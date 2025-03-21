<script>
    import { dragging } from './globals.js';
    import { experiment } from '../globals.js'
    import { writable } from 'svelte/store';

    export let routine;
    export let index;

    function on_dragover(evt) {
        evt.preventDefault();
    }

    function on_dragenter(evt) {
        hovered.set(true);
    }

    function on_dragleave(evt) {
        hovered.set(false);
    }

    function on_drop(evt) {
        evt.preventDefault();
        // we're done dragging
        hovered.set(false);
        // move dragged component to new position in the routine
        routine.relocateComponent($dragging, index)
        // update experiment so subscribed views update
        experiment.set($experiment)
    }

    let hovered = writable(false);

</script>

<div class="entry-point" class:active={$dragging !== null} class:hovered={$hovered}>
    <button 
        class="hitbox" 
        on:dragenter={on_dragenter} 
        on:dragover={on_dragover} 
        on:dragleave={on_dragleave} 
        on:drop={on_drop} 
        aria-label="Entry point"
    >
    </button>
</div>

<style>
    .entry-point {
        position: relative;
        grid-column-start: entrypoints;
        opacity: 0;
        border-radius: 100%;
        height: 1rem;
        width: 100%;
        background-color: var(--outline);
        align-self: start;
        padding: 0;
        margin: 0;
    }
    .entry-point.active {
        opacity: 1;
    }
    .entry-point.active:hover,
    .entry-point.hovered {
        opacity: 1;
        background-color: var(--primary);
    }

    .entry-point .hitbox {
        position: absolute;
        left: -2rem; right: -2rem; top: -2rem; bottom: -2rem;
        color: transparent !important;
        background-color: transparent !important;
    }
</style>