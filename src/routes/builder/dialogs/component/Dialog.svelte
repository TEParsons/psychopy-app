<script>
    import { writable } from 'svelte/store';
    import Dialog from '../../../utils/Dialog.svelte';
    export let component;
    export let helpLink = undefined;

    export let handle;
    export let id;

    import Panel from './Panel.svelte';

    let tempParams = writable(component.copyParams())


</script>

<Dialog id=id title={component.name} bind:handle={handle}>
	<Panel component={component} tempParams={tempParams} helpLink=helpLink />
</Dialog>

<style>

</style>