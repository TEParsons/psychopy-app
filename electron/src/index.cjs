const { app, dialog, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require("fs");
const { python, startPython } = require("./python.js");
const { uv } = require("./install.js");
const proc = require("child_process");

let decoder = new TextDecoder();

version = {
  major: "dev",
  minor: "1"
}

// handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

var svelte = {
  address: {
    host: "localhost",
    port: 8003,
  },
  process: undefined
};
var windows = {};

// redirect app gubbins to a subfolder so it's distinct from user data
app.setPath("userData", path.join(app.getPath("userData"), ".node"))


const createWindow = async () => {
  // make sure we have uv
  uv.executable = await python.install.uv()
  // try to get Python executable
  python.details.dir = path.join(app.getPath("appData"), "psychopy4", ".python", version.major)
  python.details.executable = python.install.python({python: "3.10", psychopy: version.major})
  console.log(`Using Python at: ${python.details.executable}`)
  // create splash
  var splash = new BrowserWindow({
      icon: path.join(__dirname, 'favicon@2x.png'),
      title:"PsychoPy",
      width: 720, 
      height: 400,
      show: false,
      transparent: true, 
      frame: false, 
      alwaysOnTop: true 
  });
  splash.loadFile(path.join(__dirname, 'splash.html'));
  splash.center();
  splash.show();

  // array which tracks which requirements are ready
  let ready = {
    svelte: false,
    mintime: false
  };

  // start the svelte side of things
  svelte.process = proc.exec(`npm run svelte:dev -- --host=${svelte.address.host} --port=${svelte.address.port}`);
  svelte.process.stdout.on("data", msg => {
    // mark as ready once we have the all clear from vite
    if (msg.includes("➜") && msg.includes(svelte.address.host) && msg.includes(`${svelte.address.port}`)) {
      ready.svelte = true;
    }
  })
  // set a minimum load time so that the splash screen is at least shown
  setTimeout(() => ready.mintime = true, 1000);
  // start python
  python.start()

  // when everything is ready, show the app
  let interval = setInterval(() => {
    if (Object.values(ready).every(val => val)) {
      // load a builder window
      newWindow("builder");
      // close the splash screen
      splash.close();
      // stop waiting
      clearInterval(interval);
    }
  }, 10)
};


function newWindow(target=null, show=true, debug=true) {
  // create window
  let win = new BrowserWindow({
    icon: path.join(__dirname, 'favicon@2x.png'),
    width: 1080,
    height: 720,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.removeMenu();
  // load target URL
  win.loadURL(`http://${svelte.address.host}:${svelte.address.port}/${target}`);
  // show when ready (if requested)
  if (show) {
    win.once("ready-to-show", evt => {
      win.show();
      win.maximize();
      win.focus();
      // show dev tools if debugging
      if (debug) {
        win.webContents.openDevTools();
      }
    })
  }
  // store handle against id
  windows[win.webContents.id] = win;

  return win.webContents.id
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on("quit", (evt, code) => {
  // close svelte
  svelte.process.kill(0);
  // close python
  python.process.kill(0);
})


function getFileTree(folder) {
  let output = [];

  try {
    for (let item of fs.readdirSync(folder, { recursive: false })) {
      // construct absolute path
      let abspath = path.join(folder, item);
      // get stats
      let stats = fs.statSync(abspath);
      // construct details
      let details = {
        relpath: item,
        abspath: abspath,
      }
      if (stats.isDirectory()) {
        // if directory, recursively get children
        details.children = getFileTree(abspath)
      } else {
        // if file, get size
        details.size = stats.size / 1000000
      }
      // append
      output.push(details)
    }
  } catch(err) {
    console.error(err)

    return output
  }

  return output
}

/* handlers which can be invoked by electron */

const handlers = {
  electron: {
    windows: {
      new: ipcMain.handle("electron.windows.new", (evt, target) => newWindow(target)),
      close: ipcMain.handle("electron.windows.close", (evt, id) => windows[id].close()),
    },
    paths: {
      documents: ipcMain.handle("electron.paths.documents", (evt) => app.getPath("documents")),
      user: ipcMain.handle("electron.paths.user", (evt) => path.join(app.getPath("appData"), "psychopy4")),
      devices: ipcMain.handle("electron.paths.devices", (evt) => path.join(app.getPath("appData"), "psychopy4", "devices.json")),
      pavlovia: {
        dir: ipcMain.handle("electron.paths.pavlovia", (evt) => path.join(app.getPath("appData"), "psychopy4", "pavlovia")),
        users: ipcMain.handle("electron.paths.pavlovia.users", (evt) => path.join(app.getPath("appData"), "psychopy4", "pavlovia", "users.json")),
        projects: ipcMain.handle("electron.paths.pavlovia.projects", (evt) => path.join(app.getPath("appData"), "psychopy4", "pavlovia", "projects.json")),
      }
    },
    files: {
      load: ipcMain.handle("electron.files.load", (evt, file) => fs.readFileSync(file, {encoding: 'utf8'})),
      save: ipcMain.handle("electron.files.save", (evt, file, content) => fs.writeFileSync(file, content, {encoding: 'utf8', mode: 0o777})),
      exists: ipcMain.handle("electron.files.exists", (evt, file) => fs.existsSync(file)),
      mkdir: ipcMain.handle("electron.files.mkdir", (evt, path, recursive=true) => fs.mkdirSync(path, { recursive: recursive })),
      openDialog: ipcMain.handle("electron.files.openDialog", (evt, options) => dialog.showOpenDialogSync(windows[evt.sender.id], options)),
      saveDialog: ipcMain.handle("electron.files.saveDialog", (evt, options) => dialog.showSaveDialogSync(windows[evt.sender.id], options)),
      scandir: ipcMain.handle("electron.files.scandir", (evt, root) => getFileTree(root))
    }
  },
  python: {
    details: ipcMain.handle("python.details", (evt) => python.details),
    output: ipcMain.handle("python.output", (evt) => python.output),
    install: {
      python: ipcMain.handle("python.install.python", (evt, version, folder) => python.install.python(version, folder)),
      package: ipcMain.handle("python.install.package", (evt, name, executable) => python.install.package(name, executable)),
      getEnvironments: ipcMain.handle("python.install.getEnvironments", (evt, folder) => python.install.getEnvironments(folder)),
      getPackages: ipcMain.handle("python.install.getPackages", (evt, executable) => python.install.getPackages(executable)),
      getPackageDetails: ipcMain.handle("python.install.getPackageDetails", (evt, executable, name) => python.install.getPackageDetails(executable, name))
    },
    isInstalled: ipcMain.handle("python.isInstalled", (evt, version, folder) => python.install.isInstalled(version, folder)),
    shell: {
      list: ipcMain.handle("python.shell.list", () => Object.keys(python.shell.shells)),
      send: ipcMain.handle("python.shell.send", (evt, id, msg) => python.shell.send(id, msg)),
      open: ipcMain.handle("python.shell.open", (evt) => python.shell.open()),
      close: ipcMain.handle("python.shell.close", (evt, id) => python.shell.close(id))
    },
    liaison: {
      constants: ipcMain.handle("python.liaison.constants", (evt) => python.liaison.constants),
      send: ipcMain.handle("python.liaison.send", (evt, message, timeout=1000) => python.liaison.send(message, timeout))
    },
    runScript: ipcMain.handle("python.runScript", (evt, file, ...args) => python.runScript(file, ...args))
  }
};

// make sure user folder exists
if (!fs.existsSync(
  path.join(app.getPath("appData"), "psychopy4")
)) {
  fs.mkdirSync(
    path.join(app.getPath("appData"), "psychopy4"),
    { recursive: true }
  )
}
