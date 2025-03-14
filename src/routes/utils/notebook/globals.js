import { writable } from 'svelte/store';

export var active_tab = writable(null);
export var n_tabs = writable(0);