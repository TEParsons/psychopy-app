import { electron, projects, python } from '$lib/globals.svelte.js';
import { current } from './globals.svelte.js';
import xmlFormat from 'xml-formatter';
import path from "path-browserify";
import { openIn } from "$lib/utils/views.js"
import { browseFileOpen } from "$lib/utils/files.js"


/* File */

export function file_new() {
    // clear current file
    current.file = {
        name: "untitled.psyexp",
        stem: "untitled",
        file: undefined
    };
    // clear experiment
    current.experiment.reset()
    // focus trial
    current.routine = current.experiment.routines['trial']
}

export async function file_open() {
    let file = await browseFileOpen([
        { description: "PsychoPy Experiments", accept: {"application/xml": [".psyexp"]} }
    ])
    // set file
    if (file) {
        current.file = file
    } else {
        return
    }
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
    if (electron) {
        // make sure file has an extension
        let filename = $state.snapshot(current.experiment.filename)
        if (!filename.endsWith(".psyexp")) {
            filename += ".psyexp"
        }
        // reveal
        electron.files.showItemInFolder(filename)
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
            await electron.files.save($state.snapshot(current.file.file), content)
        } else {
            // get file writable from handle
            let file = await current.file.file.createWritable();
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
    if (electron) {
        // get file path from electron dialog
        let file = await electron.files.saveDialog({
            defaultPath: current.experiment.filename,
            filters: [
                { name: "PsychoPy Experiments", extensions: ["psyexp"] },
                { name: 'All Files', extensions: ["*"] }
            ]
        })
        // abort if no file
        if (file === undefined) {
            return
        }
        // populate current.file
        current.file = {
            name: path.basename(file[0]),
            stem: path.basename(file[0], ".psyexp"),
            file: file
        }
    } else {
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
        // get file blob from handle
        let file = await handle[0].getFile();
        // populate current.file
        current.file = {
            name: file.name,
            stem: file.name.replace(".psyexp", ""),
            file: file
        }
    }
    
    // save
    await file_save()

    return current.file
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
    undo: undo,
    redo: redo,
    togglePiloting: togglePiloting,
    compilePython: compilePython,
    runPython: runPython
}