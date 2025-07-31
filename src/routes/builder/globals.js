import { writable } from 'svelte/store';
import { Experiment } from '$lib/experiment.svelte.js';


export let currentFile = writable(null)
export let currentRoutine = writable()
// store for the experiment object
export var experiment = writable(new Experiment("untitled.psyexp"))

// when the experiment changes, get the current Routine again from the new object
experiment.subscribe((value) => {
    currentRoutine.update((previous) => {
        if (previous && "name" in previous) {
            return value.routines.get(previous.name)
        }
    })
})

