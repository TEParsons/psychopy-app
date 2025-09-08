const { ipcRenderer, contextBridge } = require('electron');
// const fs = require("fs");


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

// placeholder: call this when Python has started
ipcRenderer.invoke("python-ready", true)