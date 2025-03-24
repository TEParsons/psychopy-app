<script>
    import { writable } from 'svelte/store';
    import Dialog from '../../../utils/Dialog.svelte';
    export let component;
    export let helpLink = undefined;

    export let dialog;
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

<Dialog id=id title={component.name} bind:dialog={dialog} on:close={discardChanges}>
	<Panel component={component} tempParams={tempParams} helpLink=helpLink />
</Dialog>

<style>

</style>