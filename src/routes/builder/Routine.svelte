<script>
    import { theme } from '../globals.js';
    import { pilot_mode, experiment } from './globals.js';

    export let name;

    let routine = $experiment.routines.get(name)
</script>

<div class=routine-canvas>
    {#each routine.components as component}
    {#if component !== null}
    <label 
        class=comp-name 
        for={component.params.get('name').val} 
        style="
        color:var(--{component.disabled ? "overlay" : "text"});
        "
    >
        {component.params.get('name').val}
        <img src="/icons/{$theme}/components/{component.tag}.svg" alt="" />
    </label>
    <div class=comp-timeline id={component.params.get('name').val}>
        <div 
            class=comp-timeline-bar 
            style="
            left:{component.visualStart * 100 / routine.visualStop}%; 
            right:{component.visualStop === null ? -10 : 100 - component.visualStop * 100 / routine.visualStop}%;
            background-color:var(--{component.disabled ? "overlay" : component.forceEnd ? "quaternary" : "secondary"});
            "
        ></div>
    </div>
    {/if}
    {/each}
</div>

<style>
    .routine-canvas {
        display: grid;
        grid-template-columns: [name] min-content [timeline] 1fr;
        grid-gap: 0;
        padding: 1rem .5rem;
    }
    .comp-name {
        display: grid;
        grid-template-columns: [name] min-content [icon] 3rem;
        grid-gap: 1rem;
        
        align-items: center;
        justify-items: center;
        grid-column-start: name;
        font-size: 1.2rem;
        padding: .5rem 1rem;
        justify-self: right;
    }
    .comp-name img {
        height: 3.5rem;
    }
    .comp-timeline {
        position: relative;
        width: 90%;
        grid-column-start: timeline;
        border-left: 1px solid var(--overlay);
        border-right: 1px solid var(--overlay);
    }
    .comp-timeline-bar {
        position: absolute;
        top: 1.25rem;
        bottom: 1.25rem;
        background-color: var(--secondary);
    }
</style>