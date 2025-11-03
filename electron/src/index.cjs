const { app, dialog, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');
const fs = require("fs");
const { python, startPython } = require("./python.js");
const { uv } = require("./install.js");
const logging = require("./logging.js");
const proc = require("child_process");
const { VelopackApp } = require('velopack');

VelopackApp.build().run();

version = {
  major: "dev",
  minor: "1"
}

var svelte = {
  address: {
    host: "localhost",
    port: 8003,
  },
  process: undefined
};
var windows = {
  splash: undefined
};

// redirect app gubbins to a subfolder so it's distinct from user data
app.setPath("userData", path.join(app.getPath("appData"), "psychopy4", ".node"))


const createWindow = () => {
  // create splash
  windows.splash = new BrowserWindow({
      icon: path.join(__dirname, 'favicon@2x.png'),
      title:"PsychoPy",
      width: 720, 
      height: 400,
      show: false,
      transparent: true, 
      frame: false, 
      alwaysOnTop: true 
  });
  windows.splash.loadFile(path.join(__dirname, 'splash.html'));
  windows.splash.center();
  windows.splash.show();
  // setup uv/python
  python.uv.installUV().then(
    resp => {
      // store UV executable once we've got it
      uv.executable = resp
      // log
      logging.log(
        `Using UV at: ${uv.executable}`
      )
      // try to get Python executable
      python.details.dir = path.join(app.getPath("appData"), "psychopy4", ".python", version.major)
      python.details.executable = python.uv.installPython({python: "3.10", psychopy: version.major})
      // report Python executable
      logging.log(
        `Using Python at: ${python.details.executable}`
      )
      // start python
      python.start()
    }
  )
  // array which tracks which requirements are ready
  let ready = {
    svelte: false,
    mintime: false
  };

  // start the svelte side of things
  logging.log(`Starting Svelte at ${svelte.address.host}:${svelte.address.port}`)
  svelte.process = proc.exec(`vite ${version.major === "dev" ? "dev" : "preview"} --host=${svelte.address.host} --port=${svelte.address.port}`);
  svelte.process.stdout.on("data", msg => {
    logging.log(msg, "STDOUT")
    // mark as ready once we have the all clear from vite
    if (msg.includes("➜") && msg.includes(svelte.address.host) && msg.includes(`${svelte.address.port}`)) {
      logging.log(`Started svelte at ${svelte.address.host}:${svelte.address.port}`)
      ready.svelte = true;
    }
  })
  svelte.process.stderr.on("data", msg => {
    logging.log(msg, "STDERR")
  })
  // set a minimum load time so that the splash screen is at least shown
  setTimeout(() => ready.mintime = true, 1000);

  // when everything is ready, show the app
  let interval = setInterval(() => {
    if (Object.values(ready).every(val => val)) {
      // load starting window
      newWindow("", true, false, false);
      // stop waiting
      clearInterval(interval);
    }
  }, 10)
};


function newWindow(target=null, show=true, fullscreen=true, debug=true) {
  // create window
  let win = new BrowserWindow({
    icon: path.join(__dirname, 'favicon@2x.png'),
    width: 940,
    height: 520,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.removeMenu();
  // load target URL
  let url = `http://${svelte.address.host}:${svelte.address.port}/${target}`
  logging.log(`Loading ${url}...`)
  win.loadURL(url);
  // show when ready (if requested)
  if (show) {
    win.once("ready-to-show", evt => {
      logging.log(`Loaded ${url}`)
      win.show();
      // fulscreen if requested
      if (fullscreen) {
        win.maximize();
      }
      // give focus
      win.focus();
      // make sure the splash screen is closed
      if (!windows.splash.isDestroyed()) {
        windows.splash.close()
      }
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
      get: ipcMain.handle("electron.windows.get", (evt, target) => Object.keys(windows).filter(
        id => !windows[id].isDestroyed()
      ).filter(
        id => String(windows[id].webContents.getURL()).startsWith(`http://${svelte.address.host}:${svelte.address.port}/${target}`)
      )),
      send: ipcMain.handle("electron.windows.send", (evt, id, tag, data) => windows[id].webContents.send(tag, data)),
      focus: ipcMain.handle("electron.windows.focus", (evt, id) => windows[id].focus()),
      close: ipcMain.handle("electron.windows.close", (evt, id) => windows[id].close()),
    },
    paths: {
      documents: ipcMain.handle("electron.paths.documents", (evt) => app.getPath("documents")),
      user: ipcMain.handle("electron.paths.user", (evt) => path.join(app.getPath("appData"), "psychopy4")),
      devices: ipcMain.handle("electron.paths.devices", (evt) => path.join(app.getPath("appData"), "psychopy4", "devices.json")),
      prefs: ipcMain.handle("electron.paths.prefs", (evt) => path.join(app.getPath("appData"), "psychopy4", "preferences.json")),
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
      scandir: ipcMain.handle("electron.files.scandir", (evt, root) => getFileTree(root)),
      showItemInFolder: ipcMain.handle("electron.files.showItemInFolder", (evt, folder) => shell.showItemInFolder(folder)),
      openPath: ipcMain.handle("electron.files.openPath", (evt, path) => shell.openPath(path)),
      openExternal: ipcMain.handle("electron.files.openExternal", (evt, url) => shell.openExternal(url))
    }
  },
  python: {
    details: ipcMain.handle("python.details", (evt) => python.details),
    uv: {
      dir: ipcMain.handle("python.uv.dir", (evt) => python.uv.dir),
      executable: ipcMain.handle("python.uv.executable", (evt) => python.uv.executable),
      installUV: ipcMain.handle("python.uv.installUV", (evt) => python.uv.installUV()),
      installPython: ipcMain.handle("python.uv.installPython", (evt, version, folder) => python.uv.installPython(version, folder)),
      getEnvironments: ipcMain.handle("python.uv.getEnvironments", (evt, folder) => python.uv.getEnvironments(folder)),
      installPackage: ipcMain.handle("python.uv.installPackage", (evt, name, executable) => python.uv.installPackage(name, executable)),
      getPackages: ipcMain.handle("python.uv.getPackages", (evt, executable) => python.uv.getPackages(executable)),
      getPackageDetails: ipcMain.handle("python.uv.getPackageDetails", (evt, name, executable) => python.uv.getPackageDetails(name, executable)),
    },
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
