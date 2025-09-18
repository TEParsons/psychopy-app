const { app, dialog, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require("fs");
const { python, startPython } = require("./python.js");
const proc = require("child_process")


// handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

var svelte = {
  address: {
    host: "localhost",
    port: 8003,
  },
  process: undefined
};
var windows = {};


const createWindow = () => {
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
    win: false,
    mintime: false
  };

  // start the svelte side of things
  svelte.process = proc.exec(`npm run dev -- --host=${svelte.address.host} --port=${svelte.address.port}`, { cwd: "../svelte" });
  svelte.process.on("spawn", evt => ready.svelte = true);
  // create a window showing builder
  let id = newWindow("builder", false);
  windows[id].once('ready-to-show', evt => ready.win = true);
  // set a minimum load time so that the splash screen is at least shown
  setTimeout(() => ready.mintime = true, 2000);
  // start python
  startPython();

  // when everything is ready, show the app
  let interval = setInterval(() => {
    if (Object.values(ready).every(val => val)) {
      // close the splash screen
      splash.close();
      // show the app
      windows[id].show();
      windows[id].maximize();
      windows[id].focus();
      // OPTIONAL show dev tools
      windows[id].webContents.openDevTools();
      // stop waiting
      clearInterval(interval);
    }
  }, 10)
};


function newWindow(target, show=true) {
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


/* handlers which can be invoked by electron */

const handlers = {
  electron: {
    windows: {
      new: ipcMain.handle("electron.windows.new", (evt, target) => newWindow(target)),
      close: ipcMain.handle("electron.windows.close", (evt, id) => windows[id].close()),
    },
    paths: {
      devices: ipcMain.handle("electron.paths.devices", (evt) => path.join(app.getPath("appData"), "psychopy3", "devices.json")),
      pavlovia: {
        dir: ipcMain.handle("electron.paths.pavlovia", (evt) => path.join(app.getPath("appData"), "psychopy3", "pavlovia")),
        users: ipcMain.handle("electron.paths.pavlovia.users", (evt) => path.join(app.getPath("appData"), "psychopy3", "pavlovia", "users.json")),
        projects: ipcMain.handle("electron.paths.pavlovia.projects", (evt) => path.join(app.getPath("appData"), "psychopy3", "pavlovia", "projects.json")),
      }
    },
    files: {
      load: ipcMain.handle("electron.files.load", (evt, file) => fs.readFileSync(file, {encoding: 'utf8'})),
      save: ipcMain.handle("electron.files.save", (evt, file, content) => fs.writeFileSync(file, content, {encoding: 'utf8', mode: 0o777})),
      exists: ipcMain.handle("electron.files.exists", (evt, file) => fs.existsSync(file)),
      mkdir: ipcMain.handle("electron.files.mkdir", (evt, path, recursive=true) => fs.mkdirSync(path, { recursive: recursive })),
      openDialog: ipcMain.handle("electron.files.openDialog", (evt, options) => dialog.showOpenDialogSync(windows[evt.sender.id], options)),
      saveDialog: ipcMain.handle("electron.files.saveDialog", (evt, options) => dialog.showSaveDialogSync(windows[evt.sender.id], options)),
    }
  },
  python: {
    details: ipcMain.handle("python.details", (evt) => python.details),
    output: ipcMain.handle("python.output", (evt) => python.output),
    liaison: {
      constants: ipcMain.handle("python.liaison.constants", (evt) => python.liaison.constants),
      send: ipcMain.handle("python.liaison.send", (evt, message, timeout=1000) => python.liaison.send(message, timeout))
    },
    runScript: ipcMain.handle("python.runScript", (evt, file, ...args) => python.runScript(file, ...args))
  }
};

// make sure user folder exists
if (!fs.existsSync(
  path.join(app.getPath("appData"), "psychopy3")
)) {
  fs.mkdirSync(
    path.join(app.getPath("appData"), "psychopy3"),
    { recursive: true }
  )
}
