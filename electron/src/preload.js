const { ipcRenderer, contextBridge } = require('electron');


// details about Electron process
const electron = {
  paths: {
    devices: () => ipcRenderer.invoke("electron.paths.devices").then(resp => resp),
    pavlovia: {
      users: () => ipcRenderer.invoke("electron.paths.pavlovia.users").then(resp => resp),
      projects: () => ipcRenderer.invoke("electron.paths.pavlovia.projects").then(resp => resp),
    }
  },
  files: {
    load: (file) => ipcRenderer.invoke("electron.files.load", file).then(resp => resp),
    save: (file, content) => ipcRenderer.invoke("electron.files.save", file, content).then(resp => resp),
  }
};
contextBridge.exposeInMainWorld('electron', electron)

// details about Python process
let python = {
  details: () => ipcRenderer.invoke("python.details").then(resp => resp),
  output: () => ipcRenderer.invoke("python.output").then(resp => resp),
  liaison: {
    send: (message) => ipcRenderer.invoke("python.liaison.send", message).then(resp => resp)
  }
}
contextBridge.exposeInMainWorld('python', python)