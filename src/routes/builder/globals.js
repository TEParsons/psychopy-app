import { writable } from 'svelte/store';


export var pilot_mode = writable(false)
export var modified = writable(false)
export var experiment = writable(null)