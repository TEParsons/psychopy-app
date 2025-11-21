import path from "path-browserify";
import { browseFileOpen, browseFileSave, parsePath } from "$lib/utils/files.js";
import { Experiment } from "$lib/experiment/experiment.svelte";
import { Script } from "$lib/experiment/script.svelte";
import { electron } from "$lib/globals.svelte"



export async function addFile(current, file, pilotMode=undefined) {
    let item
    // if given a .psyrun, add all files contained
    if (file.ext === ".psyrun") {
        for (let subfile of await loadPsyrun(file)) {
            addFile(current, subfile)
        }
        return
    }
    // if given a .psyexp, load as an experiment
    if (file.ext === ".psyexp") {
        item = new Experiment("untitled.psyexp")
        await item.fromFile(file)
    }
    // if given a .py, load as a script
    if (file.ext === ".py") {
        item = new Script(file)
    }
    // quit if filetype isn't allowed
    if (!item) {
        return
    }
    // override pilot mode if requested
    if (pilotMode !== undefined) {
        item.pilotMode = pilotMode
    }
    // add to run list
    current.runlist.push(item)
}

export async function loadPsyrun(file) {
    // load JSON file
    let content = await electron.files.load(file.file)
    // convert paths to file objects with details
    let output = []
    for (let item of JSON.parse(content)) {
        output.push(
            parsePath(
                path.join(item.path, item.file)
            )
        )
    }
    
    return output
}

export function fileNew(current) {
    // clear current files
    current.files.length = 0
}

/**
 * Open a file browser to get files.
 * 
 * @param {object} current Current Runner setup (from getContext)
 * @param {boolean} replace If true, then replace existing files with ones selected
 */
export async function fileOpen(current, replace=false) {
    // work out allowed files
    let allowedFiles
    if (replace) {
        allowedFiles = [
            // only psyrun if we're replacing
            { description: "PsychoPy Runner Configurations", accept: {"application/x-python-code": [".psyrun"]} }
        ]
    } else {
        // psyexp, py and psyrun if we're adding
        allowedFiles = [
            { description: "PsychoPy Experiments", accept: {"application/xml": [".psyexp"]} },
            { description: "Python Scripts", accept: {"application/x-python-code": [".py"]} },
            { description: "PsychoPy Runner Configurations", accept: {"application/x-python-code": [".psyrun"]} }
        ]
    }
    // open file browser
    let file = await browseFileOpen(
        allowedFiles,
        ""
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // if replacing, clear existing files
    if (replace) {
        fileNew(current)
    }
    // add file(s)
    await addFile(current, file)
}


export { newWindow } from "$lib/utils/views.svelte"