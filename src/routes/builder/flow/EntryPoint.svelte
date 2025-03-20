<script>
    import { flow_inserting } from '../globals.js';
    import { dragging } from './dragging';


    export let index;

    function on_dragover(evt) {
        evt.preventDefault();
    }
    function on_drop(evt) {
        evt.preventDefault();
        console.log([$dragging, index])
    }
</script>

<div class="entry-point {$flow_inserting || $dragging !== null ? "active" : "inactive"}">
    <button class="hitbox" on:dragover={on_dragover} on:drop={on_drop} aria-label="Entry point"></button>
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
        opacity: 0.5;
    }
    .entry-point.active:hover {
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