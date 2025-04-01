<script>
    import { experiment } from '../globals.js';
    
    import { FlowLoop } from "$lib/experiment.js";
    import Flow from './Flow.svelte';
    import LoopNode from './Loop.svelte';
    import RoutineNode from './Routine.svelte';
</script>

<div class=flow-canvas>
    <Flow>
        {#if $experiment}
        {#each $experiment.flow.dynamic as emt}
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
        overflow: auto;
    }
    
</style>