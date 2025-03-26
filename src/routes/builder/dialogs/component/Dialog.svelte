<script>
    import { writable } from 'svelte/store';
    import Dialog from '../../../utils/dialog/Dialog.svelte';
    export let component;

    export let handle;
    export let id;

    import Panel from './Panel.svelte';

    let tempParams = writable(component.copyParams())

    function discardChanges() {
        // reset temp params from component to discard any live changes
        tempParams.set(component.copyParams())
    }

    function applyChanges() {
        // apply temporary params to component
        component.params = $tempParams
    }

</script>

<Dialog 
    id=id 
    title={component.name} 
    bind:handle={handle} 
    buttons={{OK: applyChanges, CLOSE: discardChanges, HELP: component.helpLink}}
>
	<Panel component={component} tempParams={tempParams} />
</Dialog>

<style>

</style>