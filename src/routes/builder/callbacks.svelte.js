import { electron, projects, python } from '$lib/globals.svelte.js';
import { current } from './globals.svelte.js';

import path from "path-browserify";
import { openIn, showDevTools } from "$lib/utils/views.svelte"
import { browseFileOpen, browseFileSave, parsePath } from "$lib/utils/files.js";
import { Routine, HasParams } from "$lib/experiment/experiment.svelte"


/* File */

export function file_new() {
    // clear experiment
    current.experiment.reset()
    // focus trial
    current.routine = current.experiment.routines['trial']
}

export async function file_open() {
    // open file browser
    let file = await browseFileOpen(
        [
            { description: "PsychoPy Experiments", accept: {"application/xml": [".psyexp"]} }
        ],
        current.experiment.file?.parent || ""
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // construct an Experiment object from the file
    current.experiment.fromFile(file);
    // choose current routine
    if (current.experiment.routines) {
        current.routine = Object.values(current.experiment.routines)[0];
    } else {
        current.routine = undefined;
    }
    // is file a known project?
    for (let project of Object.values(projects)) {
        // placeholder: how do we query local folder?
        if (project.id.endsWith(current.experiment.file.stem)) {
            current.project = project
        }
    }
    // mark as no longer modified
    current.experiment.history.clear()

    console.log(`Loaded experiment '${current.experiment.file.name}':`, current.experiment);
}


export async function revealFolder() {
    if (electron && current.experiment.file) {
        electron.files.showItemInFolder(current.experiment.file.file)
    }
}


export async function file_save() {
    // diverge here based on whether there is a current file...
    if (current.experiment.file.file) {
        current.experiment.toFile(
            $state.snapshot(current.experiment.file)
        )
        // mark as no longer modified
        current.experiment.history.clear()
    } else {
        return file_save_as()
    }
}

export async function file_save_as() {
    // open file browser
    let file = await browseFileSave(
        [
            { description: "PsychoPy Experiments", accept: {"application/xml": [".psyexp"]} }
        ],
        current.experiment.file?.file || "untitled.psyexp"
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // set file
    current.experiment.file = file
    // save
    await file_save()

    return current.experiment.file
}

export function close() {
    window.close()
}

export function quit() {
    if (electron) {
        electron.quit()
    }
}

/* Edit */
export function undo() {
    current.experiment.history.undo();
    // restore focus to tab if possible
    if (current.routine && current.routine.name in current.experiment.routines) {
        current.routine = current.experiment.routines[current.routine.name]
    }
}

export function redo() {
    current.experiment.history.redo();
    // restore focus to tab if possible
    if (current.routine && current.routine.name in current.experiment.routines) {
        current.routine = current.experiment.routines[current.routine.name]
    }
}

/* Experiment */

export function copyRoutine(routine=undefined) {
    // use current routine if none given
    if (!routine) {
        routine = current.routine
    }
    // store JSON representation in clipboard
    current.clipboard.set(routine.toJSON())
}

export async function pasteRoutine() {
    let clipboard = await current.clipboard.get()
    // abort if nothing is in the clipboard
    if (!clipboard) {
        return
    }
    // create element from clipboard
    let element
    if (clipboard.tag === "Routine") {
        element = new Routine()
    } else {
        element = new HasParams(clipboard.tag)
    }
    element.fromJSON(clipboard)
    // if element isn't a Routine, abort
    if (![Routine, HasParams].some(cls => element instanceof cls)) {
        return
    }
    // make name valid
    let name = current.experiment.resolveNameConflict(element.name)
    // set name
    if (element instanceof Routine) {
        element.settings.params['name'].val = name
    } else {
        element.params['name'].val = name
    }
    // add to experiment and select
    current.experiment.routines[element.name] = current.routine = element
}

/* Run */


export function togglePiloting() {
    // update history
    current.experiment.history.update(`toggle pilot mode`)
    // toggle pilot mode
    current.experiment.settings.params['runMode'].val = !current.experiment.settings.params['runMode'].val;
}


export function sendToRunner() {
    openIn(current.experiment.file.file, "runner")
}


export async function compilePython() {
    // if no file, save as
    if (current.experiment.file === undefined) {
        await file_save_as()
        // if cancelled save, cancel compile
        if (current.experiment.file === undefined) {
            return
        }
    }
    // use experiment object to write
    let target = await current.experiment.writeScript("PsychoPy").catch(
        err => console.error(err)
    );
    // open in Coder
    openIn(target, "coder");

    return target
}

export async function compileJS() {
    // if no file, save as
    if (current.experiment.file === undefined) {
        await file_save_as()
        // if cancelled save, cancel compile
        if (current.experiment.file === undefined) {
            return
        }
    }
    // use experiment object to write
    let target = await current.experiment.writeScript("PsychoJS");
    // open in Coder
    openIn(target, "coder");

    return target
}

export async function runPython(executable) {
    // write Python script
    let target = await compilePython();
    // run script
    current.experiment.runPython(false, executable)

    return true
}

export async function runJS() {
    if (!python) {
        return
    }
    if (current.experiment.pilotMode) {
        // compile to JS
        await compileJS()
        // get PsychoJS library
        await python.liaison.send(
            {
                command: "run",
                args: [
                    "psychopy.tools.servertools:getPsychoJS"
                ],
                kwargs: {
                    cwd: current.experiment.file.parent,
                    useVersion: $state.snapshot(current.experiment.settings.params['Use version']?.val)
                }
            }, 
            100000
        )
        // start a server
        await python.liaison.send(
            {
                command: "init",
                args: [
                    "pilot_js_server",
                    "psychopy.tools.servertools:Server"
                ],
                kwargs: {
                    cwd: current.experiment.file.parent,
                    port: 12002
                }
            }, 
            10000
        ).catch(
            err => console.error(err)
        )
        // open experiment in browser
        await python.liaison.send(
            {
                command: "run",
                args: [
                    "pilot_js_server.openInBrowser"
                ],
                kwargs: {
                    params: {__pilotToken: "local"}
                }
            }, 
            10000
        )
    }
    // todo: Run in JS
}

/** Views */
export { newWindow, showWindow, showDevTools } from "$lib/utils/views.svelte"


export default {
    new: file_new,
    open: file_open,
    revealFolder: revealFolder,
    save: file_save,
    saveAs: file_save_as,
    close: close,
    quit: quit,
    undo: undo,
    redo: redo,
    togglePiloting: togglePiloting,
    sendToRunner: sendToRunner,
    compilePython: compilePython,
    runPython: runPython,
    compileJS: compileJS,
    runJS: runJS,
    showDevTools: showDevTools
}