const { ipcRenderer, contextBridge } = require('electron');


// details about Electron process
const electron = {
  paths: {
    devices: () => ipcRenderer.invoke("electron.paths.devices").then(resp => resp),
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
  }
};
contextBridge.exposeInMainWorld('electron', electron)

// details about Python process
let python = {
  details: () => ipcRenderer.invoke("python.details").then(resp => resp),
  output: () => ipcRenderer.invoke("python.output").then(resp => resp),
  liaison: {
    constants: () => ipcRenderer.invoke("python.liaison.constants").then(resp => resp),
    send: (message, timeout=1000) => ipcRenderer.invoke("python.liaison.send", message, timeout).then(resp => resp)
  },
  runScript: (file, ...args) => ipcRenderer.invoke("python.runScript", file, ...args).then(resp => resp)
}
contextBridge.exposeInMainWorld('python', python)