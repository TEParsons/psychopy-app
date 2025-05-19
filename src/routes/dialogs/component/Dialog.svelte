<script>
    import Dialog from '$lib/utils/dialog/Dialog.svelte';
    import { ParamsNotebook } from "$lib/utils/paramCtrls"
    export let component;

    export let handle;
    export let id;

    let notebook;
    import { experiment, currentRoutine } from '../../builder/globals.js';
    import { updateHistory } from '../../builder/history.js';

    function discardChanges(evt) {
        // discard changes to params
        notebook.discardChanges(evt)
    }

    function applyChanges(evt) {
        // update history
        updateHistory()
        // apply changes to params
        notebook.applyChanges(evt)
        // if component is newly created, add it to the current Routine
        if (!$currentRoutine.components.includes(component) && component.tag !== "RoutineSettingsComponent") {
            $currentRoutine.addComponent(component)
        }
        // refresh
        experiment.set($experiment)
    }

</script>

<Dialog 
    id={id} 
    title="Editing: {component.name}"
    bind:handle={handle} 
    buttons={{
        OK: applyChanges, 
        APPLY: applyChanges,
        CANCEL: discardChanges, 
        HELP: component.helpLink,
    }}
>
    <ParamsNotebook bind:this={notebook} element={component}></ParamsNotebook>
</Dialog>

<style>

</style>