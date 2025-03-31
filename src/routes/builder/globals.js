import { get, writable } from 'svelte/store';
import { Experiment } from './experiment.js';
import { browser } from '$app/environment';


export let currentFile = writable(null)
export let currentRoutine = writable()
// store for the experiment object
export var experiment = writable(new Experiment("untitled.psyexp"))
// handle change history
export var changeHistory = writable([]);
export var changeFuture = writable([]);
export function updateHistory() {
    let past = get(changeHistory);
    let present = get(experiment);
    past.push(present.toJSON())
    // clear future
    changeFuture.set([])
    // limit number of past states to save memory
    while (past.length >= 16) {
        delete past[0];
        past = past.slice(1)
    }
    // update writables
    experiment.set(present)
    changeHistory.set(past)
}
export function clearHistory() {
    // clear history
    changeHistory.set([])
    changeFuture.set([])
}

