import { current, actions } from './globals.svelte.js';
import { Experiment } from "$lib/experiment.svelte.js";
import { writable, get } from 'svelte/store';
import xmlFormat from 'xml-formatter';


/* File */

export function file_new() {
    current.file = null;
    // create blank experiment
    current.experiment = new Experiment("untitled.psyexp")
    // mark as no longer modified
    actions.clear()
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
    current.experiment = Experiment.fromXML(file.name, node)
    // mark as no longer modified
    actions.clear()

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
    // get file writable from handle
    let handle = current.file
    let file = await handle.createWritable();
    // write to file
    file.seek(0);
    file.write(content);
    file.close();
    // mark as no longer modified
    actions.clear()
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
    actions.undo();
}

export function redo() {
    actions.redo();
}

/* Experiment */

export function toggle_pilot_mode() {
    // update change history
    actions.update()
    // change mode
    current.experiment.pilotMode = !current.experiment.pilotMode
}

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