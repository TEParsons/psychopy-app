<script>
    import Dialog from '../../../utils/Dialog.svelte';
    export let component;
    export let helpLink = undefined;

    export let dialog;
    export let id;

    import Panel from './Panel.svelte'
</script>

<Dialog id=id title={component.name} bind:dialog={dialog} on:close>
	<Panel component={component} helpLink=helpLink />
</Dialog>

<style>

</style>