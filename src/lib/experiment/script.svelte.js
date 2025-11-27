import { python, electron } from "$lib/globals.svelte";


export class Script {
    pilotMode = $state.raw(false);
    // file this script is saved to (if any)
    file = $state();
    // text content of this script
    content = $state.raw();
    // these are only relevant if script is open in an editor
    canUndo = $state.raw(false)
    canRedo = $state.raw(false)
    editor = $state.raw()

    constructor(file) {
        this.file = file
    }

    setPilotMode(value) {
        this.pilotMode = value
    }

    /**
     * Run this script in Python.
     * 
     * @param {string || undefined} executable Path to the Python executable to run in (leave 
     * undefined to use default executable)
     */
    async runPython(executable=undefined) {
        // fail if there's no Python to run in
        if (!python) {
            console.error("Script running is not available in browser.")
            return
        }
        // run
        await python.runScript(
            this.file.file, 
            executable || await python.details().then(resp => resp.executable),
            ...(this.pilotMode ? ["--pilot"] : [])
        )
    }

    /**
     * Write the current contents of this script to a file
     */
    toFile(file) {
        // parse to object if needed
        if (typeof file === "string") {
            file = parsePath(file)
        }
        // if we were keeping track of history, clear it now
        this.canUndo = false
    }

    /**
     * Load the contents of a file to this script
     */
    async fromFile(file) {
        // parse to object if needed
        if (typeof file === "string") {
            file = parsePath(file)
        }
        // load content from file
        if (electron) {
            this.content = await electron.files.load(file.file)
        } else {
            this.content = await file.handle.text()
        }
        // store file
        this.file = file
    }
}