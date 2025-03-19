<script>
    import { pilot_mode, experiment, flow_inserting } from '../globals.js';
    import { Routine, FlowLoop } from '../utils.js'
    import Flow from './Flow.svelte';
    import LoopNode from './Loop.svelte';
    import RoutineNode from './Routine.svelte';
</script>

<div class=flow-canvas>
    <Flow>
        {#if $experiment}
        {#each $experiment.flow as emt}
        {#if emt instanceof FlowLoop}
        <LoopNode element={emt}></LoopNode>
        {:else}
        <RoutineNode element={emt}></RoutineNode>
        {/if}
        {/each}
        {/if}
    </Flow>
</div>

<style>
    .flow-canvas {
        padding: 1rem;
        padding-top: 3rem;
        display: flex;
        align-items: start;
    }
    
</style>