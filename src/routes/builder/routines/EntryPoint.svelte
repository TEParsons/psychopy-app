<script>
    import { Component } from "$lib/experiment.svelte";
    import { getContext } from "svelte";
    
    let current = getContext("current");
    
    let {
        routine,
        index
    } = $props()

    let hovered = $state(false);
    let moving = $derived(
        current.moving && [
            Component
        ].includes(current.moving.constructor)
    )
    let inserting = $derived(
        current.inserting && [
            Component
        ].includes(current.inserting.constructor)
    )

    function insertHere(evt) {
        evt.preventDefault();

        // if moving, relocate to here
        if (current.moving) {
            // update history
            current.experiment.history.update(`move ${current.moving.name}`);
            // move component
            current.moving.routine.relocateComponent(current.moving.index, index, routine);
            // we're done moving
            current.moving = undefined;
        }
        // if inserting, insert here
        if (current.inserting) {
            // update history
            current.experiment.history.update(`insert ${current.inserting.name}`);
            // insert
            routine.insertComponent(current.inserting, index);
            // we're done inserting
            current.inserting = undefined;
        }
        // remove hover flag
        hovered = false;
    }

</script>

<div 
    class="entry-point" 
    class:active={moving || inserting} 
    class:hovered={hovered}
>
    <svg>
        <use xlink:href="icons/sym-arrow-right{hovered ? "-hl" : ""}.svg"></use>
    </svg>
    
    <button 
        class="hitbox" 
        ondragenter={(evt) => {hovered = true}} 
        ondragover={(evt) => {evt.preventDefault()}} 
        ondragleave={(evt) => {hovered = false}} 
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
        position: relative;
        grid-column-start: entrypoints;
        opacity: 0;
        align-self: start;
        padding: 0;
        margin: 0;
    }
    .entry-point svg {
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