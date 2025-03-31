import { writable, get } from 'svelte/store';
import { experiment } from './globals';

// writables to keep track of history/future
export var changeHistory = writable([]);
export var changeFuture = writable([]);


/**
 * Store the current experiment as a JSON restore point (call before any change)
 */
export function updateHistory() {
    let past = get(changeHistory);
    let present = get(experiment);
    past.push(present.toJSON());
    // clear future
    changeFuture.set([]);
    // limit number of past states to save memory
    while (past.length >= 16) {
        delete past[0];
        past = past.slice(1);
    }
    // update writables
    experiment.set(present);
    changeHistory.set(past);
}


/**
 * Clear past and future states
 */
export function clearHistory() {
    // clear history
    changeHistory.set([]);
    changeFuture.set([]);
}
