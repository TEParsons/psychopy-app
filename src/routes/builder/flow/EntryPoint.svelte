<script>
    import { dragging } from './dragging.js';
    import { experiment } from '../globals.js'
    import { updateHistory } from '../history.js';
    import { writable } from 'svelte/store';

    export let index;

    function on_dragover(evt) {
        evt.preventDefault();
    }

    function on_dragenter(evt) {
        hovered.set($dragging !== null);
    }

    function on_dragleave(evt) {
        hovered.set(false);
    }

    function on_drop(evt) {
        evt.preventDefault();
        // update history
        updateHistory();
        // we're done dragging
        hovered.set(false);
        // make sure it's a valid element
        if ($dragging === null) {
            return;
        }
        // move dragged routine to new position in the flow
        $experiment.flow.relocateElement($dragging, index)
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
        opacity: 0;
        border-radius: 100%;
        height: .75rem;
        width: .75rem;
        padding: 0;
        margin: 0;
        position: relative;
        transform: translateY(-50%);
        background-color: var(--outline);
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