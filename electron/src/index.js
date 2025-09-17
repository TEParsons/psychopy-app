const { app, dialog, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require("fs");
const { python, startPython } = require("./python.js");


// handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

var win;

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

  // create the browser window.
  win = new BrowserWindow({
    icon: path.join(__dirname, 'favicon@2x.png'),
    width: 1080,
    height: 720,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.removeMenu();
  // start the app
  // placeholder: currently doing this via mprocs, could it be started here?
  // load the app
  win.loadURL('http://localhost:5173/builder');
  // start python
  startPython();
  // switch to window after 5s (or when ready, if longer)
  let ready = {
    win: false,
    mintime: false
  }
  // after 5s, mark that minimum splash time has passed
  setTimeout(() => ready.mintime = true, 5000)
  // when the window has loaded, mark that it's ready
  win.once('ready-to-show', () => ready.win = true);
  // when everything is ready, show the app
  let interval = setInterval(() => {
    if (Object.values(ready).every(val => val)) {
      // close the splash screen
      splash.close();
      // show the app
      win.show();
      win.maximize();
      win.focus();
      // OPTIONAL show dev tools
      win.webContents.openDevTools();
      // stop waiting
      clearInterval(interval);
    }
  }, 10)
};



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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


/* handlers which can be invoked by electron */

const handlers = {
  electron: {
      paths: {
        devices: () => ipcMain.handle("electron.paths.devices", (evt) => path.join(app.getPath("appData"), "psychopy3", "devices.json")),
        pavlovia: {
          users: ipcMain.handle("electron.paths.pavlovia.users", (evt) => path.join(app.getPath("appData"), "psychopy3", "pavlovia", "users.json")),
          projects: ipcMain.handle("electron.paths.pavlovia.projects", (evt) => path.join(app.getPath("appData"), "psychopy3", "pavlovia", "projects.json")),
        }
      },
      files: {
        load: ipcMain.handle("electron.files.load", (evt, file) => fs.readFileSync(file, {encoding: 'utf8'})),
        save: ipcMain.handle("electron.files.save", (evt, file, content) => fs.writeFileSync(file, content, {encoding: 'utf8'})),
        openDialog: ipcMain.handle("electron.files.openDialog", (evt, options) => dialog.showOpenDialogSync(win, options)),
        saveDialog: ipcMain.handle("electron.files.saveDialog", (evt, options) => dialog.showSaveDialogSync(win, options)),
      }
  },
  python: {
    details: () => ipcMain.handle("python.details", (evt) => python.details),
    output: () => ipcMain.handle("python.output", (evt) => python.output),
    liaison: {
      constants: ipcMain.handle("python.liaison.constants", (evt) => python.liaison.constants),
      send: ipcMain.handle("python.liaison.send", (evt, message, timeout=1000) => python.liaison.send(message, timeout))
    },
    runScript: ipcMain.handle("python.runScript", (evt, file, ...args) => python.runScript(file, ...args))
  }
};