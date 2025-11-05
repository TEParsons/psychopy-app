import { electron, projects, python } from '$lib/globals.svelte.js';
import { current } from './globals.svelte.js';
import xmlFormat from 'xml-formatter';
import path from "path-browserify";
import { openIn } from "$lib/utils/views.js"
import { browseFileOpen, browseFileSave, parsePath } from "$lib/utils/files.js"


/* File */

export function file_new() {
    // clear current file
    current.file = {
        file: undefined,
        parent: undefined,
        name: "untitled.psyexp",
        stem: "untitled",
        ext: ".psyexp"
    };
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
        current.file?.parent || ""
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // set file
    current.file = file
    // read content
    let content
    if (electron) {
        content = await electron.files.load(current.file.file)
    } else {
        content = await current.file.handle.text()
    }
    // load xml
    let xml_parser = new DOMParser()
    let document = xml_parser.parseFromString(content, "application/xml");
    let node = document.getElementsByTagName("PsychoPy2experiment")[0];
    // construct an Experiment object from the file
    current.experiment.fromXML(current.file.name.replace(".psyexp", ""), node);
    if (current.experiment.routines) {
        current.routine = Object.values(current.experiment.routines)[0];
    } else {
        current.routine = undefined;
    }
    // is file a known project?
    for (let project of Object.values(projects)) {
        // placeholder: how do we query local folder?
        if (project.id.endsWith(current.file.stem)) {
            current.project = project
        }
    }
    // mark as no longer modified
    current.experiment.history.clear()

    console.log(`Loaded experiment '${current.file.name}':`, current.experiment);
}


export async function revealFolder() {
    if (electron && current.file) {
        electron.files.showItemInFolder(current.file.file)
    }
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
    if (current.file.file) {
        if (electron) {
            await electron.files.save(
                $state.snapshot(current.file.file), 
                content
            )
        } else {
            // get file writable from handle
            let file = await current.file.handle.createWritable();
            // write to file
            file.seek(0);
            file.write(content);
            file.close();
        }
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
        current.file?.file || "untitled.psyexp"
    )
    // abort if no file
    if (file === undefined) {
        return
    }
    // set file
    current.file = file
    // save
    await file_save()

    return current.file
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


export function togglePiloting() {
    // update history
    current.experiment.history.update(`toggle pilot mode`)
    // toggle pilot mode
    current.experiment.settings.params['runMode'].val = !current.experiment.settings.params['runMode'].val;
}


export async function compilePython() {
    // if no file, save as
    if (current.file === undefined) {
        await file_save_as()
        // if cancelled save, cancel compile
        if (current.file === undefined) {
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
    if (current.file === undefined) {
        await file_save_as()
        // if cancelled save, cancel compile
        if (current.file === undefined) {
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
    await python.runScript(
        target, 
        executable || await python.details().then(resp => resp.executable),
        ...(current.experiment.pilotMode ? ["--pilot"] : [])
    )

    return true
}

/** Views */
export { newWindow } from "$lib/utils/views.js"


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
    compilePython: compilePython,
    runPython: runPython
}