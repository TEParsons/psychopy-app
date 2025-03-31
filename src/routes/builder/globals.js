import { writable } from 'svelte/store';
import { Experiment } from './experiment.js';


export let currentFile = writable(null)
export let currentRoutine = writable()
// store for the experiment object
export var experiment = writable(new Experiment("untitled.psyexp"))

