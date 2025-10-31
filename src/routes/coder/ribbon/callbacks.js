import { electron, python, projects } from '$lib/globals.svelte.js';
import { browseFileOpen } from "$lib/utils/files.js";
import { current } from '../globals.svelte.js';


/* File */

export function file_new() {
    // add new tab with blank file
    current.pages.push({
        label: "untitled.py",
        file: undefined,
        content: "for n in y:\n    print(n)",
        editor: undefined
    })
    // focus new tab
    current.tab = current.pages.length - 1
}

export async function file_open() {
    let file = await browseFileOpen([
        { description: "Python Scripts", accept: {"text/x-python-code": [".py"]} },
        { description: "JavaScript Scripts", accept: {"text/javascript": [".js"]} },
        { description: "Data Files", accept: {"text/csv": [".csv"], "application/json": [".json"]}},
    ])
    // abort if no file
    if (file === undefined) {
        return
    }
    // read content
    let content
    if (electron) {
        content = await electron.files.load(file.file)
    } else {
        content = await file.handle.text()
    }
    // open file
    current.pages.push({
        label: file.name,
        file: file.file,
        content: content,
        editor: undefined
    })
    // focus new tab
    current.tab = current.pages.length - 1
}

export async function file_save() {
    // get experiment as xml
    let node = current.experiment.toXML()
    // convert to an xml string
    let ser = new XMLSerializer()
    let content = ser.serializeToString(node)
    // make human readable
    content = xmlFormat(content)
    // diverge here based on whether there is a current file...
    if (current.file) {
        // get file writable from handle
        let handle = current.file
        let file = await handle.createWritable();
        // write to file
        file.seek(0);
        file.write(content);
        file.close();
        // mark as no longer modified
        current.experiment.history.clear()
    } else {
        await file_save_as()
    }
    
}

export async function file_save_as() {
    // open a file picker
    let handle = await window.showSaveFilePicker({
        types: [{
            description: "PsychoPy Experiment",
            accept: {
                "application/xml": [".psyexp"]
            }
        }],
        suggestedName: current.experiment.filename + ".psyexp"
    });
    // set current file from result
    current.file = handle;
    // save
    await file_save()
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

export { newWindow } from "$lib/utils/views.js";