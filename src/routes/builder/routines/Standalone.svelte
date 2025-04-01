<script>
    import { writable } from "svelte/store";
    import Panel from "../dialogs/component/Panel.svelte";
    import { sortParams, unsortParams } from "$lib/experiment";
    import { experiment } from '../globals';
    import { updateHistory } from '../history.js';


    export let component
    
    let tempParams = writable(sortParams(component.copyParams()))

    function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        tempParams.set(
            sortParams(component.copyParams())
        )
    }

    function applyChanges(evt) {
        // update history
        updateHistory();
        // apply temporary params to component
        component.params = unsortParams($tempParams)
        // refresh
        experiment.set($experiment)
    }
</script>

<div class=standalone-routine-canvas>
	<Panel component={component} tempParams={tempParams} />
    <button
        on:click={applyChanges} 
    >Apply</button>
</div>