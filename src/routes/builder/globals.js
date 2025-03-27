import { get, writable } from 'svelte/store';
import { Experiment } from './experiment.js'


export var modified = writable(false)
export var experiment = writable(new Experiment("untitled.psyexp"))
export let currentFile = writable(null)
experiment.subscribe(() => {modified.set(true)})
