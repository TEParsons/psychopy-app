import { python } from "$lib/globals.svelte";


export class Script {
    file = $state()
    pilotMode = $state.raw(false)

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
}