<script>
    import { LoopInitiator, LoopTerminator, Routine, StandaloneRoutine } from '$lib/experiment.svelte.js';
    import { getContext } from "svelte";
    
    let current = getContext("current");
    
    let {
        index=undefined
    } = $props()

    let hovered = $state(false);

    let moving = $derived(
        current.moving && [
            Routine, 
            StandaloneRoutine, 
            LoopInitiator, 
            LoopTerminator
        ].includes(current.moving.constructor)
    )
    let inserting = $derived(
        current.inserting && [
            Routine, 
            StandaloneRoutine, 
            LoopInitiator, 
            LoopTerminator
        ].includes(current.inserting.constructor)
    )

    function insertHere(evt) {
        
        // if dragging, move dragged element here
        if (current.moving) {
            // update history
            current.experiment.history.update(`insert ${current.moving.name} into flow`);
            // relocate it
            current.experiment.flow.relocateElement(current.moving, index)
            // done dragging
            current.moving = undefined
        }
        // if inserting, insert element here
        if (current.inserting) {
            // update history
            current.experiment.history.update(`insert ${current.inserting.name} into flow`);
            // if inserting a terminator, make sure it's after the initiator
            if (current.inserting instanceof LoopTerminator) {
                if (0 < index < current.inserting.initiator.index) {
                    // get index of initiator
                    let ogIndex = $state.snapshot(current.inserting.initiator.index)
                    // move initiator to requested index
                    current.experiment.flow.relocateElement(
                        current.inserting.initiator, 
                        index
                    )
                    // insert at the initiator's old index
                    index = ogIndex + 1
                }
            }
            // insert
            current.experiment.flow.insertElement(current.inserting, index);
            // next steps depend on type of element inserted
            if (current.inserting instanceof LoopInitiator) {
                // ready to insert terminator
                current.inserting.addTerminator();
                current.inserting = current.inserting.terminator;
            } else {
                // done inserting
                current.inserting = undefined;
            }
        }
    }
</script>

<div 
    class="entry-point" 
    class:active={moving || inserting} 
    class:hovered={hovered}
>
    <button 
        class="hitbox" 
        ondragenter={(evt) => hovered = true} 
        ondragover={(evt) => evt.preventDefault()} 
        ondragleave={(evt) => hovered = false} 
        onmouseenter={(evt) => {hovered = true}} 
        onmouseleave={(evt) => {hovered = false}} 
        onfocusin={(evt) => {hovered = true}}
        onfocusout={(evt) => {hovered = false}} 
        ondrop={insertHere} 
        onclick={insertHere}
        aria-label="Entry point"
        tabindex={moving || inserting ? 0 : -1}
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
    .entry-point.active.hovered {
        opacity: 1;
        background-color: var(--red);
    }

    .entry-point .hitbox {
        position: absolute;
        left: -2rem; right: -2rem; top: -2rem; bottom: -2rem;
        color: transparent !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }
</style>