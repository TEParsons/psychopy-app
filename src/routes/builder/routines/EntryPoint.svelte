<script>
    import { theme } from "$lib/globals.svelte.js";
    import { current, actions } from "../globals.svelte.js";

    let {
        routine,
        index
    } = $props()

    function on_drop(evt) {
        evt.preventDefault();
        // update history
        actions.update();
        // make sure it's a valid element
        if (current.dragging === undefined) {
            return;
        }
        // move dragged component to new position in the routine
        routine.relocateComponent(current.dragging, index)
        // we're done dragging
        hovered = false;
        current.dragging = undefined;
    }

    let hovered = $state(false);

</script>

<div class="entry-point" class:active={current.dragging !== undefined} class:hovered={hovered}>
    <img src="icons/{theme}/sym-arrow-right{hovered ? "-hl" : ""}.svg" alt=">" />
    <button 
        class="hitbox" 
        ondragenter={(evt) => {hovered = true}} 
        ondragover={(evt) => {evt.preventDefault()}} 
        ondragleave={(evt) => {hovered = false}} 
        ondrop={on_drop} 
        aria-label="Entry point"
    >
    </button>
</div>

<style>
    .entry-point {
        position: relative;
        grid-column-start: entrypoints;
        opacity: 0;
        align-self: start;
        padding: 0;
        margin: 0;
    }
    .entry-point img {
        height: 1rem;
    }
    .entry-point.active {
        opacity: 1;
    }

    .entry-point .hitbox {
        position: absolute;
        left: -2rem; right: -2rem; top: -2rem; bottom: -2rem;
        color: transparent !important;
        background-color: transparent !important;
    }
</style>