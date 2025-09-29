import proc from "child_process";
import path from "path";
const decoder = new TextDecoder();
import { app } from "electron";
import { uv, installUV, installPython } from "./install.js"
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
    setTimeout(evt => reject("Getting Liaison constants timed out"), 1000)
  })
}

export async function startPython() {
  // log start
  console.log("Starting Python...")
  // get constants
  python.liaison.constants = await getConstants().catch(err => console.error(err));
  // spawn a Python process
  python.process = proc.spawn(python.details.executable, [
    "-m", "pycompanion.liaison.websocket", python.liaison.address
  ])
  // add listener for errors
  python.process.stderr.on("data", evt => message(python.output.stderr, "STDERR", evt))
    // add listener to know when process exits
  python.process.on("exit", evt => {
      // log stopped
      console.log(`Python process stopped, reason: ${evt?.message}`);
      // mark dead
      python.details.alive = false
  })
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
    // initial commands to run once Liaison is ready
    python.liaison.ready.promise.then(evt => {
      // start a ping pong to keep the connection alive
      setInterval(
        () => {
          python.liaison.send(
            {
              command: "ping"
            }, 
            30000
          ).catch(
            err => console.error(`Liaison isn't responding (sent a ping and didn't receive a pong within 30s)`)
          )
        }, 
        30000
      )
      // activate plugins
      python.liaison.send({
        command: "run",
        args: ["psychopy.plugins:activatePlugins"]
      }, 10000).catch(
        err => console.error(`Failed to activate plugins: ${err}`)
      )
    }).catch(
      err => console.error(`Liaison timed out: ${err}`)
    )
  })
}

async function send(msg, timeout=1000) {
  // wait for liaison to exist before sending messages
  await python.liaison.ready.promise
  // wait for other messages to finish
  await Promise.all(python.liaison.pending)
  // generate random ID
  let msgid = crypto.randomUUID()
  // send message with ident
  python.socket.send(
    JSON.stringify({
      command: msg,
      id: msgid
    })
  );
  // create promise to await a reply
  let promise = new Promise((resolve, reject) => {
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
  // store promise in liaison pending
  python.liaison.pending.push(promise)
  
  return promise
}


function runScript(file, executable, ...args) {
  // if not given, use default executable
  executable = executable || python.details.executable;
  // spawn a process
  let script = proc.execFile(executable, [
    file, ...args
  ], {cwd: path.dirname(file)})
  // log stdout
  script.stdout.on(
    "data", evt => console.log("STDOUT", evt)
  )
  script.stderr.on(
    "data", evt => console.log("STDERR", evt)
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
    executable: undefined,
    dir: undefined,
    alive: false,
  },
  runScript: runScript,
  install: {
    uv: installUV,
    python: installPython
  },
  start: startPython,
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
    pending: []
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
