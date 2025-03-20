<script>
    export let element;
    import EntryPoint from './EntryPoint.svelte'   
    import { flow_inserting } from '../globals'; 
    import { dragging } from './dragging';
    import { json } from '@sveltejs/kit';

    function on_dragstart(evt) {
        dragging.set(element.index)
    }
    function on_dragend(evt) {
        dragging.set(null)
    }

</script>

<EntryPoint index={element.index}></EntryPoint>
<div class=routine id=flow-{element.name} draggable="true" on:dragstart={on_dragstart} on:dragend={ondragend} role="none">{element.name}</div>

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
</style>