import { electron, python, projects } from '$lib/globals.svelte.js';
import { browseFileOpen, browseFileSave, parsePath } from "$lib/utils/files.js";
import { current } from './globals.svelte.js';


/* File */

export function fileNew() {
    // add new tab with blank file
    current.pages.push(
        new Script(parsePath("untitled.py"))
    )
    // focus new tab
    current.tab = $state.snapshot(current.pages.length) - 1
}

export async function fileOpen() {
    let file = await browseFileOpen(
        [
            { description: "Python Scripts", accept: {"text/x-python-code": [".py"]} },
            { description: "JavaScript Scripts", accept: {"text/javascript": [".js"]} },
            { description: "Data Files", accept: {"text/csv": [".csv"], "application/json": [".json"]}},
        ],
        current.pages[current.tab]?.file?.parent
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // load from file
    current.openFile(file)
}

export async function fileSave() {
    // if no file yet, save as instead
    if (!current.pages[current.tab]?.file) {
        return fileSaveAs()
    }
    // save
    current.pages[current.tab].toFile(current.pages[current.tab].file)    
}

export async function fileSaveAs() {
    // open file browser
    let file = await browseFileSave(
        [
            { description: "Python Scripts", accept: {"text/x-python-code": [".py"]} },
            { description: "JavaScript Scripts", accept: {"text/javascript": [".js"]} },
            { description: "Data Files", accept: {"text/csv": [".csv"], "application/json": [".json"]}},
        ],
        current.pages[current.tab]?.file?.file || "untitled.py"
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // set file
    current.pages[current.tab].file = file
    // save
    await fileSave()
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



/* Views */

export { newWindow } from "$lib/utils/views.svelte";