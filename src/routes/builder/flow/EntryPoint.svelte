<script>
    import { dragging, inserting } from './globals.js';
    import { experiment } from '../globals.js'
    import { updateHistory } from '../history.js';
    import { writable } from 'svelte/store';
    import { Routine } from '$lib/experiment.js';

    export let index;

    function onDragOver(evt) {
        evt.preventDefault();
    }

    function onDragEnter(evt) {
        hovered.set($dragging !== null || $inserting !== null);
    }

    function onDragLeave(evt) {
        hovered.set(false);
    }

    function onDrop(evt) {
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

    function onClick(evt) {
        // if not inserting anything, do nothing
        if ($inserting === null) {
            return;
        }
        // store state
        updateHistory()
        // if inserting a Routine, insert it at index
        if ($inserting instanceof Routine) {
            // insert
            $experiment.flow.insertElement($inserting, index)
            // done inserting
            inserting.set(null)
        }
        // update experiment so subscribed views update
        experiment.set($experiment)
    }

    let hovered = writable(false);

</script>

<div class="entry-point" class:active={$dragging !== null || $inserting !== null} class:hovered={$hovered}>
    <button 
        class="hitbox" 
        on:dragenter={onDragEnter} 
        on:dragover={onDragOver} 
        on:dragleave={onDragLeave} 
        on:drop={onDrop} 
        on:click={onClick}
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
        background-color: var(--red);
    }

    .entry-point .hitbox {
        position: absolute;
        left: -2rem; right: -2rem; top: -2rem; bottom: -2rem;
        color: transparent !important;
        background-color: transparent !important;
    }
</style>