import { electron, python, projects } from '$lib/globals.svelte.js';
import { browseFileOpen, browseFileSave } from "$lib/utils/files.js";
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
    let file = await browseFileOpen(
        [
            { description: "Python Scripts", accept: {"text/x-python-code": [".py"]} },
            { description: "JavaScript Scripts", accept: {"text/javascript": [".js"]} },
            { description: "Data Files", accept: {"text/csv": [".csv"], "application/json": [".json"]}},
        ],
        current.file?.parent
    )
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
        if (electron) {
            await electron.files.save(
                $state.snapshot(current.file.file),
                content
            )
        } else {
            // create writable
            let file = await current.file.handle.createWritable();
            // write to file
            file.seek(0);
            file.write(content);
            file.close();
        }
        // mark as no longer modified
        current.experiment.history.clear()
    } else {
        await file_save_as()
    }
    
}

export async function file_save_as() {
    // open file browser
    let file = await browseFileSave(
        [
            { description: "Python Scripts", accept: {"text/x-python-code": [".py"]} },
            { description: "JavaScript Scripts", accept: {"text/javascript": [".js"]} },
            { description: "Data Files", accept: {"text/csv": [".csv"], "application/json": [".json"]}},
        ],
        current.file?.file || "untitled.py"
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // set file
    current.file = file
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

export { newWindow } from "$lib/utils/views.svelte";