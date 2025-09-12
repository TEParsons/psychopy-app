import proc from "child_process";
import path from "path";
import { fileURLToPath } from 'url';
const decoder = new TextDecoder();

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
  // get constants
  python.liaison.constants = await getConstants();
  // spawn a Python process
  python.process = proc.spawn(python.details.executable, [
    "-m", "pycompanion.liaison.websocket", python.liaison.address
  ])
  // add listener to know when process exits
  python.process.on("exit", evt => {
      // log stopped
      console.log(`Python process stopped, reason: ${evt.message}`);
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
        python.socket.onclose = evt => console.log(`Closed websocket on ws://${python.liaison.address}`)
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
    setTimeout(evt => reject(evt), timeout)
  }).catch(reason => {
    console.log("Command failed:", msg, reason)
  })
}

// array with information about/from Python
export const python = {
  details: {
    executable: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", ".venv/Scripts/python.exe"),
    alive: false,
  },
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
  socket: undefined,
  process: undefined
}
