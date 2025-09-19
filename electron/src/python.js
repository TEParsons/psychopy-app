import proc from "child_process";
import path from "path";
const decoder = new TextDecoder();
import { uv, installPython } from "./install.js"
import { randomUUID } from "node:crypto";


function message(target, flag, evt) {
  let msg = evt;
  // decode message
  if (evt instanceof Buffer) {
    msg = decoder.decode(evt);
  }
  // store message
  if (target) {
    target.push(msg);
  }
  // log message
  // console.log(flag, msg);
}

function getConstants() {
  // run module
  let constants = proc.spawn(python.details.executable, [
    "-m", "pycompanion.liaison.constants"
  ])
  // create promise to await response
  return new Promise((resolve, reject) => {
    // resolved to the returned value...
    constants.stdout.once(
      "data", evt => resolve(
        // ...parsed as a JSON
        JSON.parse(
          decoder.decode(evt)
        )
      )
    )
    // timeout after 1s
    setTimeout(evt => reject(evt), 1000)
  })
}

export async function startPython() {
  // uncomment the line below on first run (when packaged, the installer will handle this)
  // await python.install()
  
  // get constants
  python.liaison.constants = await getConstants();
  // spawn a Python process
  python.process = proc.spawn(python.details.executable, [
    "-m", "pycompanion.liaison.websocket", python.liaison.address
  ])
  // add listener to know when process exits
  python.process.on("exit", evt => {
      // log stopped
      console.log(`Python process stopped, reason: ${evt?.message}`);
      // mark dead
      python.details.alive = false
  })
  // add listener for errors
  python.process.stderr.on("data", evt => message(python.output.stderr, "STDERR", evt))
  // actions to take on spawn
  python.process.on("spawn", evt => {
    // log started
    console.log("Python process started");
    // mark alive
    python.details.alive = true;
    // add listener for Liaison waking up
    python.process.stdout.on("data", evt => {
      if (decoder.decode(evt) === `${python.liaison.constants.START_MARKER}@${python.liaison.address}`) {
        // log started
        console.log("Liaison started")
        // open a websocket
        python.socket = new WebSocket(`ws://${python.liaison.address}`);
        // listen for websocket events
        python.socket.onopen = evt => {
          console.log(`Opened websocket on ws://${python.liaison.address}`);
          // resolve ready promise
          python.liaison.ready.resolve();
        }
        python.socket.onclose = evt => console.log(`Closed websocket on ws://${python.liaison.address}, reason: ${evt.reason}`)
        python.socket.onerror = evt => console.log(`Websocket error on ws://${python.liaison.address}: ${evt.message}`)
        // listen for messages
        python.socket.onmessage = evt => message(python.output.liaison, "MESSAGE")
        // stop listening for wakeup
        python.process.stdout.on(
          "data", evt => message(python.output.stdout, "STDOUT", evt)
        )
      }
    })
    // reject after 1s
    setTimeout(evt => python.liaison.ready.reject(evt), 1000)
  })
}

async function send(msg, timeout=1000) {
  // wait for liaison to exist before sending messages
  await python.liaison.ready.promise
  // generate random ID
  let msgid = crypto.randomUUID()
  // send message with ident
  python.socket.send(
    JSON.stringify({
      command: msg,
      id: msgid
    })
  );

  return new Promise((resolve, reject) => {
    // define listener to find reply then remove itself
    let lsnr = evt => {
      // parse reply
      let data = JSON.parse(evt.data)
      // check ID
      if (data.id !== msgid) {
        return
      }
      // if ID matches, store and stop listening
      message(python.output.liaison, "RESP", data)
      python.socket.removeEventListener("message", lsnr)
      // resolve or reject
      if ("response" in data) {
        resolve(data.response)
      } else {
        reject(data.error)
      }
    }
    // listen for reply
    python.socket.addEventListener("message", lsnr)
    // timeout after
    setTimeout(evt => reject(`Message timed out: ${JSON.stringify(msg, undefined, 4)}`), timeout)
  })
}


function runScript(file, ...args) {
  // spawn a process
  let script = proc.execFile(python.details.executable, [
    file, ...args
  ], {cwd: path.dirname(file)})
  // log stdout
  script.stdout.on(
    "data", evt => console.log("STDOUT", decoder.decode(evt))
  )
  script.stderr.on(
    "data", evt => console.log("STDERR", decoder.decode(evt))
  )
  // return a promise linked to its state
  return new Promise((resolve, reject) => {
    script.on(
      "exit", evt => {
        console.log(`Finished running ${file}`);
        resolve(evt);
      }
    )
    script.on(
      "error", err => {
        console.log(`Failed to run ${file}: ${err.message}`);
        reject(evt.message);
      }
    )
  })
}


class PythonShell {

  tokens = {
    stdout: {
      start: "###START-STDOUT###",
      stop: "###END-STDOUT###"
    },
    stderr: {
      start: "###START-STDERR###",
      stop: "###END-STDERR###"
    },
  }

  constructor() {
    // create process
    this.process = proc.spawn(
      python.details.executable, 
      ['-i'],
      { shell: true }
    );
    this.send("import sys")
  }

  send(msg, timeout=2000) {
    let thusfar = {
      message: [],
      stdout: false,
      stderr: false
    };

    // listen for returned values
    let promise = new Promise((resolve, reject) => {
      for (let src of ["stdout", "stderr"]) {
        this.process[src].on("data", resp => {
          // decode
          let value = decoder.decode(resp)
          // sanitize
          let safevalue = value
            .replaceAll(this.tokens[src].stop, "")
            .replaceAll(">>> ", "")
            .trim()
          // store sanitized value
          if (safevalue) {
            thusfar.message.push(safevalue)
          }
          // stop listening if end of input
          if (value.includes(this.tokens[src].stop)) {
            thusfar[src] = true
            this.process[src].removeAllListeners()
          }
          // if done, resolve
          if (thusfar.stdout && thusfar.stderr) {
            resolve(thusfar.message)
          }
        })
      }

      setTimeout(evt => {
        resolve(thusfar.message)
      }, timeout)
    })
    // store message for return
    thusfar.message.push(
      `>> ${msg}`
    )
    // send message
    this.process.stdin.write(
      `${msg}\nprint("${this.tokens.stdout.stop}", file=sys.stdout)\nprint("${this.tokens.stderr.stop}", file=sys.stderr)\n`
    );
    
    return promise
  }
}


// array with information about/from Python
export const python = {
  details: {
    executable: decoder.decode(
      proc.execSync(`${uv.executable} python find 3.10`)
    ).trim(),
    alive: false,
  },
  runScript: runScript,
  install: installPython,
  output: {
    stdout: [],
    stderr: [],
    liaison: []
  },
  liaison: {
    address: "localhost:8002",
    constants: undefined,
    send: send,
    ready: Promise.withResolvers(),
  },
  shell: {
    shells: {},
    send: (id, msg) => python.shell.shells[id].send(msg), 
    open: () => {
      let id = randomUUID();
      python.shell.shells[id] = new PythonShell();

      return id
    },
    close: id => {
      python.shell.shells[id].close();
      delete python.shell.shells[id];
    }
  },
  socket: undefined,
  process: undefined
}
