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
  console.log(flag, msg);
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
        // resolve promise
        python.socket = new WebSocket(`ws://${python.liaison.address}`);
        // listen for websocket events
        python.socket.onopen = evt => {
          console.log(`Opened websocket on ws://${python.liaison.address}`);
          // import device manager
          python.liaison.send({
            command: "register",
            kwargs: {
              name: "DeviceManager",
              target: "psychopy.hardware:DeviceManager"
            }
          })
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
  })
}

function send(msg, timeout=1000) {
  python.socket.send(
    JSON.stringify(msg)
  );

  return new Promise((resolve, reject) => {
    // listen for reply
    python.socket.addEventListener(
      "message", evt => {
        // parse reply
        let data = JSON.parse(evt.data)
        message(python.output.liaison, "RESP", data)
        // resolve
        resolve(data)
      }, {once: true}
    )
    // timeout after
    setTimeout(evt => reject(evt), timeout)
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
    alive: false
  },
  socket: undefined,
  process: undefined
}
