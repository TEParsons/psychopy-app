<script>
    import { writable } from 'svelte/store';
    import Dialog from '../../../utils/dialog/Dialog.svelte';
    export let component;

    export let handle;
    export let id;

    import Panel from './Panel.svelte';
    import { sortParams, unsortParams } from '../../experiment.js';
    import { experiment, updateHistory } from '../../globals';
    import { currentRoutine } from '../../globals.js'

    let tempParams = writable(sortParams(component.copyParams()))

    function discardChanges(evt) {
        // reset temp params from component to discard any live changes
        tempParams.set(
            sortParams(component.copyParams())
        )
    }

    function applyChanges(evt) {
        // update history
        updateHistory()
        // apply temporary params to component
        component.params = unsortParams($tempParams)
        // if component is newly created, add it to the current Routine
        if (!$currentRoutine.components.includes(component)) {
            $currentRoutine.addComponent(component)
        }
        // refresh
        experiment.set($experiment)
    }

</script>

<Dialog 
    id=id 
    title={component.name} 
    bind:handle={handle} 
    buttons={{
        OK: applyChanges, 
        APPLY: applyChanges,
        CANCEL: discardChanges, 
        HELP: component.helpLink,
    }}
>
	<Panel component={component} tempParams={tempParams} />
</Dialog>

<style>

</style>