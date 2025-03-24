<script>
    import { theme } from '../../globals.js';
    import { pilot_mode, experiment } from '../globals.js';
    
    import ComponentLabel from './Label.svelte';
    import ComponentTimelineBar from './TimelineBar.svelte';
    import TimelineHeader from './Timeline.svelte';
    import EntryPoint from './EntryPoint.svelte';
    import Dialog from '../dialogs/component/Dialog.svelte';

    export let routine;

    // get information about ticks from routine
    let ticks = routine.visualTicks;

    let settingsDlg;
</script>

<div class=routine-canvas>
    <button 
        class=horizontal 
        id=routine-settings
        on:click={() => settingsDlg.showModal()}
    >
        <img src="icons/{$theme}/btn-settings.svg" alt="" />
        <label for=routine-settings>Routine settings</label>
    </button>
    <Dialog 
        id="dlg-{routine.name}"
        component={routine.settings} 
        helpLink="" 
        bind:handle={settingsDlg}
    ></Dialog>

    {#if routine.components}
    <TimelineHeader ticks={ticks}></TimelineHeader>
    {/if}

    {#each routine.components as component}
    {#if component !== null}
    <EntryPoint routine={routine} index={component.index}></EntryPoint>
    <ComponentLabel component={component}></ComponentLabel>
    <ComponentTimelineBar component={component} ticks={ticks}></ComponentTimelineBar>
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
    #routine-settings {
        grid-column-start: name;
        justify-self: start;
        z-index: 2;
    }
    button#routine-settings:enabled:hover {
        background-color: var(--crust);
    }
</style>