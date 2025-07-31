<script>
    import { experiment } from '../globals.svelte.js'
    import { LoopInitiator, LoopTerminator, Routine } from '$lib/experiment.svelte.js';
    import { getContext } from "svelte";

    let {
        index=undefined
    } = $props()

    let current = getContext("current")
    let hovered = $state(false)

    let history = getContext("history")

    function insertHere(evt) {
        // update history
        history.update();
        // if dragging, move dragged element here
        if (current.moving) {
            // relocate it
            experiment.flow.relocateElement(current.moving, index)
            // done dragging
            current.moving = undefined
        }
        // if inserting, insert element here
        if (current.inserting) {
            // insert
            experiment.flow.insertElement(current.inserting, index);
            // next steps depend on type of element inserted
            if (current.inserting instanceof LoopInitiator) {
                // ready to insert terminator
                current.inserting.addTerminator();
                current.inserting = current.inserting.terminator;
            } else {
                // done inserting
                current.inserting = null;
            }
        }
    }
</script>

<div 
    class="entry-point" 
    class:active={current.moving || current.inserting} 
    class:hovered={hovered}
>
    <button 
        class="hitbox" 
        ondragenter={(evt) => evt.preventDefault()} 
        ondragover={(evt) => evt.preventDefault()} 
        ondragleave={() => hovered=false} 
        ondrop={insertHere} 
        onclick={insertHere}
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