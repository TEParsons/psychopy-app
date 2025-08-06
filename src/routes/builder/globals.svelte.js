import { Experiment } from "$lib/experiment.svelte.js";


export let current = $state({
    file: undefined,
    experiment: new Experiment("untitled.psyexp"),
    routine: undefined,
    moving: undefined,
    inserting: undefined,
    undo: () => {
        // do nothing if we have no past
        if (!current.experiment.history.past) {
            return
        }
        // store present as future
        current.experiment.history.future.push(
            current.experiment.toJSON()
        )
        // restore last state
        current.experiment = Experiment.fromJSON(
            current.experiment.history.past.pop()
        )
    },
    redo: () => {
        // do nothin if we have no future
        if (!current.experiment.history.future) {
            return
        }
        // restore next state
        current.experiment = Experiment.fromJSON(
            current.experiment.history.future.shift()
        )
    }
})
