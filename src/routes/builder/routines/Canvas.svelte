<script>
    import { theme } from '../../globals.js';
    import { pilot_mode, experiment } from '../globals.js';
    
    import ComponentLabel from './Label.svelte';
    import ComponentTimelineBar from './TimelineBar.svelte';
    import TimelineHeader from './Timeline.svelte';
    import EntryPoint from './EntryPoint.svelte';

    export let name;

    // get information about ticks from routine
    let ticks = $experiment.routines.get(name).visualTicks;
</script>

<div class=routine-canvas>
    <button class=horizontal id=routine-settings>
        <img src="icons/{$theme}/btn-settings.svg" alt="" />
        <label for=routine-settings>Routine settings</label>
    </button>

    {#if $experiment.routines.get(name).components}
    <TimelineHeader ticks={ticks}></TimelineHeader>
    {/if}

    {#each $experiment.routines.get(name).components as component}
    {#if component !== null}
    <EntryPoint routine={$experiment.routines.get(name)} index={component.index}></EntryPoint>
    <ComponentLabel component={component}></ComponentLabel>
    <ComponentTimelineBar component={component} ticks={ticks}></ComponentTimelineBar>
    {/if}
    {/each}
    <EntryPoint routine={$experiment.routines.get(name)} index=-1></EntryPoint>
</div>

<style>
    .routine-canvas {
        display: grid;
        grid-template-columns: [entrypoints] 1rem [name] min-content [undershoot] 3rem [timeline] 1fr [overshoot] 3rem;
        grid-gap: 0;
        padding-bottom: 2rem;
    }

    #routine-settings {
        background-color: var(--mantle);
        margin-bottom: 0;
        justify-self: start;
    }
    #routine-settings:hover {
        background-color: var(--primary);
        color: var(--primary-text);
    }
</style>