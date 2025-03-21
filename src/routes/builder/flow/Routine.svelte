<script>
    export let element;
    import EntryPoint from './EntryPoint.svelte'   
    import { dragging } from './dragging.js';
    import { currentPage as currentRoutine } from '../routines/globals.js';
    import { json } from '@sveltejs/kit';

    function on_dragstart(evt) {
        dragging.set(element.index)
    }
    function on_dragend(evt) {
        dragging.set(null)
    }
    function on_click(evt) {
        currentRoutine.set(element.name)
    }

</script>

<EntryPoint index={element.index}></EntryPoint>
<div 
    class=routine 
    id=flow-{element.name} 
    draggable="true" 
    on:dragstart={on_dragstart} 
    on:dragend={on_dragend} 
    on:click={on_click}
    class:active={$currentRoutine === element.name}
    role="none"
>{element.name}</div>

<style>
    .routine {
        background-color: var(--secondary);
        color: var(--secondary-text);
        padding: 1rem;
        line-height: 1rem;
        border-radius: 1rem;
        margin-top: -1.5rem;
        z-index: 1;
    }
    .active {
        font-weight: bold;
    }
</style>