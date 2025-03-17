<script>
    import FlowCanvas from './Canvas.svelte';
    import { flow_inserting } from '../globals.js';

    function start_inserting() {
        flow_inserting.set(true)
    }

</script>

<div class=flow-panel>
    <div class=flow-buttons>
        <button class=horizontal id=add-routine on:click={start_inserting}>
            <img src="/icons/light/btn-routine.svg" alt="" />
            <label for=add-routine>Add Routine</label>
        </button>
        <button class=horizontal id=add-loop>
            <img src="/icons/light/btn-loop.svg" alt="" />
            <label for=add-loop>Add Loop</label>
        </button>
    </div>
    <FlowCanvas></FlowCanvas>
</div>

<style>
    .flow-panel {
        display: grid;
        grid-template-columns: [buttons] min-content [canvas] 1fr;
    }
    .flow-buttons {
        padding: 1rem;
        display: grid;
        grid-auto-flow: row;
    }
</style>