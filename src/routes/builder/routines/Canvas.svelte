<script>
    import { theme } from "$lib/globals.svelte.js";
    import { Button } from "$lib/utils/buttons";
    import Component from './Component.svelte';
    import TimelineHeader from './Timeline.svelte';
    import EntryPoint from './EntryPoint.svelte';
    import { ParamsNotebook } from "$lib/utils/paramCtrls";
    import Dialog from "$lib/utils/dialog/Dialog.svelte";

    let {
        routine=undefined
    } = $props()

    let showDialog = $state(false)
    let settingsNotebook;

</script>

<div class=routine-canvas>
    <div class=button-container>
        <Button 
            label="Routine settings"
            icon="icons/{theme}/btn-settings.svg"
            tooltip="Edit settings for this Routine"
            onclick={() => showDialog = true}
            horizontal 
        ></Button>
    </div>

    <Dialog 
        id="{routine.settings.name}-parameters"
        title="Editing: {routine.settings.name}"
        bind:shown={showDialog} 
        onopen={() => settingsNotebook.setRestorePoint()}
        buttons={{
            OK: () => {}, 
            APPLY: () => settingsNotebook.setRestorePoint(), 
            CANCEL: () => settingsNotebook.applyRestorePoint(), 
            HELP: routine.settings.helpLink,
        }}
    >
        <ParamsNotebook bind:this={settingsNotebook} element={routine.settings}></ParamsNotebook>
    </Dialog>

    {#if routine.components}
    <TimelineHeader bind:ticks={routine.visualTicks}></TimelineHeader>
    {/if}

    {#each routine.components as component}
    {#if component !== null}
    <Component component={component} ticks={routine.visualTicks}></Component>
    {/if}
    {/each}
    <EntryPoint routine={routine} index=-1></EntryPoint>
</div>

<style>
    .routine-canvas {
        display: grid;
        grid-template-columns: [entrypoints] 1rem [name] min-content [undershoot] 3rem [timeline] 1fr [overshoot] 3rem;
        grid-gap: 0;
        padding-bottom: 2rem;
    }
    .button-container {
        grid-column-start: entrypoints;
        grid-column-end: undershoot;
        justify-self: start;
        margin: .5rem;
        z-index: 2;
    }
</style>