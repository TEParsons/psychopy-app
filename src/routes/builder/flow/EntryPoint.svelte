<script>
    import { flow_inserting } from '../globals.js';

    function stop_inserting() {
        flow_inserting.set(false)
    }
</script>

<button class="entry-point {$flow_inserting ? "active" : "inactive"}" on:click={stop_inserting}></button>

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
    }
    .entry-point.active:hover {
        opacity: 1;
    }
</style>