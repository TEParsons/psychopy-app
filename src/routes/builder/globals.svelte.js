import { Experiment } from "$lib/experiment.svelte.js";


export let current = $state({
    file: undefined,
    experiment: new Experiment("untitled.psyexp"),
    routine: undefined,
    moving: undefined,
    inserting: undefined
})
export let actions = $state({
    past: [],
    future: [],
    update: () => {
        // store experiment state
        actions.past.push(
            current.experiment.toJSON()
        )
        // limit to 16 items to save memory
        while (actions.past.length >= 16) {
            delete actions.past[0]
            actions.past = actions.past.slice(1);
        }
        // clear future
        actions.future = []
    },
    undo: () => {
        // do nothing if we have no past
        if (!actions.past) {
            return
        }
        // store present as future
        actions.future.push(
            current.experiment.toJSON()
        )
        // restore last state
        current.experiment = Experiment.fromJSON(
            actions.past.pop()
        )
    },
    redo: () => {
        // do nothin if we have no future
        if (!actions.future) {
            return
        }
        // restore next state
        current.experiment = Experiment.fromJSON(
            actions.future.shift()
        )
    },
    clear: () => {
        actions.past = []
        actions.future = []
    }
})
