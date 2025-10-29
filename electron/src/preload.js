const { ipcRenderer, contextBridge } = require('electron');


// details about Electron process
const electron = {
  windows: {
    new: (target) => ipcRenderer.invoke("electron.windows.new", target).then(resp => resp),
    close: (id) => ipcRenderer.invoke("electron.windows.close", id).then(resp => resp),
  },
  paths: {
    documents: () => ipcRenderer.invoke("electron.paths.documents").then(resp => resp),
    user: () => ipcRenderer.invoke("electron.paths.user").then(resp => resp),
    devices: () => ipcRenderer.invoke("electron.paths.devices").then(resp => resp),
    prefs: () => ipcRenderer.invoke("electron.paths.prefs").then(resp => resp),
    pavlovia: {
      dir: () => ipcRenderer.invoke("electron.paths.pavlovia").then(resp => resp),
      users: () => ipcRenderer.invoke("electron.paths.pavlovia.users").then(resp => resp),
      projects: () => ipcRenderer.invoke("electron.paths.pavlovia.projects").then(resp => resp),
    }
  },
  files: {
    load: (file) => ipcRenderer.invoke("electron.files.load", file).then(resp => resp),
    save: (file, content) => ipcRenderer.invoke("electron.files.save", file, content).then(resp => resp),
    exists: (file) => ipcRenderer.invoke("electron.files.exists", file).then(resp => resp),
    mkdir: (path, recursive=true) => ipcRenderer.invoke("electron.files.mkdir", path, recursive).then(resp => resp),
    openDialog: (options) => ipcRenderer.invoke("electron.files.openDialog", options).then(resp => resp),
    saveDialog: (options) => ipcRenderer.invoke("electron.files.saveDialog", options).then(resp => resp),
    scandir: (root) => ipcRenderer.invoke("electron.files.scandir", root).then(resp => resp),
    showItemInFolder: (folder) => ipcRenderer.invoke("electron.files.showItemInFolder", folder),
    openPath: (path) => ipcRenderer.invoke("electron.files.openPath", path),
    openExternal: (url) => ipcRenderer.invoke("electron.files.openExternal", url)
  }
};
contextBridge.exposeInMainWorld('electron', electron)

// details about Python process
const python = {
  details: () => ipcRenderer.invoke("python.details").then(resp => resp),
  output: () => ipcRenderer.invoke("python.output").then(resp => resp),
  install: {
    python: (version, folder) => ipcRenderer.invoke("python.install.python", version, folder).then(resp => resp),
    package: (name, executable) => ipcRenderer.invoke("python.install.package", name, executable).then(resp => resp),
    getEnvironments: (folder) => ipcRenderer.invoke("python.install.getEnvironments", folder).then(resp => resp),
    getPackages: (executable) => ipcRenderer.invoke("python.install.getPackages", executable).then(resp => resp),
    getPackageDetails: (executable, name) => ipcRenderer.invoke("python.install.getPackageDetails", executable, name).then(resp => resp),
  },
  output: {
    stdout: () => ipcRenderer.invoke("python.output.stdout").then(resp => resp),
    stderr: () => ipcRenderer.invoke("python.output.stderr").then(resp => resp)
  },
  shell: {
    list: () => ipcRenderer.invoke("python.shell.list").then(resp => resp),
    send: (id, msg) => ipcRenderer.invoke("python.shell.send", id, msg).then(resp => resp),
    open: () => ipcRenderer.invoke("python.shell.open").then(resp => resp),
    close: (id) => ipcRenderer.invoke("python.shell.close", id).then(resp => resp)
  },
  liaison: {
    constants: () => ipcRenderer.invoke("python.liaison.constants").then(resp => resp),
    send: (message, timeout=1000) => ipcRenderer.invoke("python.liaison.send", message, timeout).then(resp => resp)
  },
  runScript: (file, ...args) => ipcRenderer.invoke("python.runScript", file, ...args).then(resp => resp)
}
contextBridge.exposeInMainWorld('python', python)