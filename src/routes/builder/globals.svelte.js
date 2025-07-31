import { Experiment } from '$lib/experiment.svelte.js';


export let currentFile = $state(null)
// store for the experiment object
export var experiment = $state(new Experiment("untitled.psyexp"))
export let currentRoutine = $state()

