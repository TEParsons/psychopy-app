import { pilot_mode, experiment, modified, currentFile } from './globals.js';
import { Experiment } from "./experiment.js";
import { writable, get } from 'svelte/store';


/* File */

export function file_new() {
    currentFile.set(null);
    experiment.set(null);
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
    currentFile.set(handle[0])
    // get file blob from handle
    let file = await handle[0].getFile();
    // load xml
    let xml_parser = new DOMParser()
    let document = xml_parser.parseFromString(await file.text(), "application/xml");
    // construct an Experiment object from the file
    let exp = new Experiment(file.name, document)
    experiment.set(exp);
    // mark as no longer modified
    modified.set(false);
}

export async function file_save() {
    // get experiment as xml
    let node = get(experiment).toXML()
    // convert to an xml string
    let ser = new XMLSerializer()
    let content = ser.serializeToString(node)
    // get file writable from handle
    let handle = get(currentFile)
    let file = await handle.createWritable();
    // write to file
    file.seek(0);
    file.write(content);
    file.close();
    // mark as no longer modified
    modified.set(false);
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
        suggestedName: get(experiment).filename + ".psyexp"
    });
    // set current file from result
    currentFile.set(handle);
    // save
    await file_save()
}

/* Edit */

/* Experiment */

export function toggle_pilot_mode() {
    pilot_mode.update((val) => {return !val})
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