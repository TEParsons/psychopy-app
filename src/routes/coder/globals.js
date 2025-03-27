import { writable } from 'svelte/store';


export var modified = writable(false)
export var file = writable(".")
