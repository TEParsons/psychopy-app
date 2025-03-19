import { pilot_mode, experiment, modified } from './globals.js';
import { ExperimentFile } from './utils.js'


/* File */

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
    // get file blob from handle
    let file = await handle[0].getFile();
    // load xml
    let xml_parser = new DOMParser()
    let document = xml_parser.parseFromString(await file.text(), "application/xml");
    // construct an Experiment object from the file
    let exp = new ExperimentFile(document)
    experiment.set(exp);
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