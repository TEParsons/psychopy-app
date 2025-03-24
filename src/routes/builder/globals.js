import { get, writable } from 'svelte/store';


export var pilot_mode = writable(false)
export var modified = writable(false)
export var experiment = writable(null)
export let currentFile = writable(null)
experiment.subscribe(() => {modified.set(true)})
// connect UI pilot mode toggle to the corresponding experiment param
experiment.subscribe((val) => {
    if (val !== null) {
        if (val.settings.params.get("runMode").val === "1") {
            pilot_mode.set(false);
        } else {
            pilot_mode.set(true);
        }
    }
})
pilot_mode.subscribe((val) => {
    let exp = get(experiment)
    // skip if no experiment
    if (exp === null) {
        return
    }
    // get runmode param
    let param = exp.settings.params.get("runMode")
    // set it according to new value
    if (param !== undefined) {
        if (val) {
            param.val = "0";
        } else {
            param.val = "1";
        }
    }
})
