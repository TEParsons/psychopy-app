import proc from "child_process";
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

export function startPython() {
  // spawn a Python process
  python.process = proc.spawn(python.details.executable, [
  "-m", "psychopy.session", "--host", python.liaison.address
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
      if (decoder.decode(evt) === `LIAISON.CONNECTED@${python.liaison.address}`) {
        // log started
        console.log("Liaison started")
        // resolve promise
        python.socket = new WebSocket(`ws://${python.liaison.address}`);
        // listen for Python connection
        python.socket.onopen = evt => console.log(`Opened websocket on ws://${python.liaison.address}`)
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
  let resp;
  python.socket.addEventListener(
    "message", evt => resp = evt, {once: true}
  )

  function check(resolve, reject) {
    console.log("Checking...")
    setTimeout(() => {
      if (resp !== undefined) {
        let data = JSON.parse(resp.data)
        message(python.output.liaison, "RESP", data.result)
        resolve(data.result)
      } else {
        check(resolve, reject)
      }
    }, 100)
  }
  
  return new Promise(check)
}

// array with information about/from Python
export const python = {
  details: {
    executable: "C:/Users/Todd/Documents/GitHub/psychopy/venv310/Scripts/python.exe",  // placeholder: use system python for now
    alive: false,
  },
  output: {
    stdout: [],
    stderr: [],
    liaison: []
  },
  liaison: {
    address: "localhost:8002",
    send: send,
    alive: false
  },
  socket: undefined,
  process: undefined
}
