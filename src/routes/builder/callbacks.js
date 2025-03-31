import { experiment, currentFile, changeHistory, changeFuture, clearHistory, updateHistory } from './globals.js';
import { Experiment } from "./experiment.js";
import { writable, get } from 'svelte/store';
import xmlFormat from 'xml-formatter';


/* File */

export function file_new() {
    currentFile.set(null);
    // create blank experiment
    experiment.set(
        new Experiment("untitled.psyexp")
    );
    // mark as no longer modified
    clearHistory()
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
    let node = document.getElementsByTagName("PsychoPy2experiment")[0];
    // construct an Experiment object from the file
    experiment.set(
        Experiment.fromXML(file.name, node)
    )
    // mark as no longer modified
    clearHistory()

    console.log(`Loaded experiment ${file.name}:`, get(experiment));
}

export async function file_save() {
    // get experiment as xml
    let node = get(experiment).toXML()
    // convert to an xml string
    let ser = new XMLSerializer()
    let content = ser.serializeToString(node)
    // make human readable
    content = xmlFormat(content)
    // get file writable from handle
    let handle = get(currentFile)
    let file = await handle.createWritable();
    // write to file
    file.seek(0);
    file.write(content);
    file.close();
    // mark as no longer modified
    clearHistory()
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
export function undo() {
    // get writables
    let past = get(changeHistory)
    let present = get(experiment)
    let future = get(changeFuture)
    // remove last item from history array
    let last = past.pop()
    // prepend current experiment to future array
    future.unshift(present.toJSON())
    // set experiment from change history
    present = Experiment.fromJSON(last)
    // update writables
    changeHistory.set(past)
    experiment.set(present)
    changeFuture.set(future) 
}

export function redo() {

}

/* Experiment */

export function toggle_pilot_mode() {
    updateHistory()
    get(experiment).pilotMode = !get(experiment).pilotMode;
    experiment.set(get(experiment))
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