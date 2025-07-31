<script>
    import Dialog from '$lib/utils/dialog/Dialog.svelte';
    import { ParamsNotebook } from "$lib/utils/paramCtrls";
    import { getContext } from 'svelte';

    let {
        component,
        shown=$bindable()
    } = $props()

    let notebook;
    import { currentRoutine } from '../../builder/globals.js';

    function discardChanges(evt) {
        // discard changes to params
        notebook.discardChanges(evt)
    }

    let history = getContext("history")
    let current = getContext("current")

    function applyChanges(evt) {
        // update history
        history.update()
        // apply changes to params
        notebook.applyChanges(evt)
        // if component is newly created, add it to the current Routine
        if (!$currentRoutine.components.includes(component) && component.tag !== "RoutineSettingsComponent") {
            $currentRoutine.addComponent(component)
        }
    }

</script>

<Dialog 
    id="{component.name}-parameters"
    title="Editing: {component.name}"
    bind:shown={shown} 
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