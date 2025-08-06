import { Experiment } from "$lib/experiment.svelte.js";


export let current = $state({
    file: undefined,
    experiment: new Experiment("untitled.psyexp"),
    routine: undefined,
    moving: undefined,
    inserting: undefined,
})
