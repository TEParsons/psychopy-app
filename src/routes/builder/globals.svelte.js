import { Experiment } from "$lib/experiment";
import { Clipboard } from "$lib/utils/clipboard";


export let current = $state({
    user: undefined,
    file: undefined,
    project: undefined,
    experiment: new Experiment("untitled.psyexp"),
    routine: undefined,
    moving: undefined,
    inserting: undefined,
    clipboard: new Clipboard()
})
