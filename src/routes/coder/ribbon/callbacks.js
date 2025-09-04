import { projects } from '$lib/globals.svelte.js';
import { current } from '../globals.svelte.js';


/* File */

export function file_new() {
    // add new tab with blank file
    current.pages.push({
        file: "untitled.py",
        content: ""
    })
    // focus new tab
    current.tab = current.pages.length - 1
}

export async function file_open() {
    // get file handle from system dialog
    let handle = await window.showOpenFilePicker({
        types: [{
            description: "PsychoPy Experiments",
            accept: {
                "application/xml": [".psyexp"]
            }
        }]
    });
    // set current file from result
    current.file = handle[0]
    // get file blob from handle
    let file = await handle[0].getFile();
    // load xml
    let xml_parser = new DOMParser()
    let document = xml_parser.parseFromString(await file.text(), "application/xml");
    let node = document.getElementsByTagName("PsychoPy2experiment")[0];
    // construct an Experiment object from the file
    current.experiment.fromXML(file.name.replace(".psyexp", ""), node);
    if (current.experiment.routines) {
        current.routine = Object.values(current.experiment.routines)[0];
    } else {
        current.routine = undefined;
    }
    // is file a known project?
    for (let project of Object.values(projects)) {
        // placeholder: how do we query local folder?
        if (project.id.endsWith(file.name.replace(".psyexp", ""))) {
            current.project = project
        }
    }
    // mark as no longer modified
    current.experiment.history.clear()

    console.log(`Loaded experiment ${file.name}:`, current.experiment);
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

export function new_builder_frame() {
    window.open("/builder");
}
export function new_coder_frame() {
    window.open("/coder");
}
export function new_runner_frame() {
    window.open("/runner");
}