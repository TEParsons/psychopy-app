import { Experiment } from "$lib/experiment.svelte.js";


export let current = $state({
    user: undefined,
    file: undefined,
    project: undefined,
    experiment: new Experiment("untitled.psyexp"),
    routine: undefined,
    moving: undefined,
    inserting: undefined,
})
