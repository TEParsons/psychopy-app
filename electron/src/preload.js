const { ipcRenderer, contextBridge } = require('electron')


const liaison = {
  runPythonScript: async (scriptPath, processEventHandlers) => await ipcRenderer.invoke("runPythonScript", scriptPath)
};

contextBridge.exposeInMainWorld('liaison', liaison)

// placeholder: call this when Python has started
ipcRenderer.invoke("python-ready", true)