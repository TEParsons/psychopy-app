<script>
    import { FlowLoop } from "$lib/experiment.svelte.js";
    import LoopNode from './Loop.svelte';
    import RoutineNode from './Routine.svelte';
    import { theme } from "$lib/globals.svelte.js";
    import EntryPoint from './EntryPoint.svelte';
    import { getContext } from "svelte";
    
    let current = getContext("current");

</script>

<div class=flow-canvas>
    <div class="flow">
        <div class=flowline-container>
            <div class=flowline></div>
            <img class=flowline-arrow src="/icons/{theme}/sym-arrow-right.svg" alt="<"/>
        </div>
        {#if current.experiment}
            {#each current.experiment.flow.dynamic as emt}
                {#if emt instanceof FlowLoop}
                    <LoopNode element={emt}></LoopNode>
                {:else}
                    <RoutineNode element={emt}></RoutineNode>
                {/if}
            {/each}
        {/if}
        <EntryPoint index=-1></EntryPoint>
    </div>
</div>

<style>
    .flow {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: start;
        gap: 1rem;
        padding: 2rem;
        padding-top: 0;
    }
    .flowline-container {
        border-left: 2px solid var(--outline);
        position: absolute;
        top: -1rem;
        left: 0;
        right: 0;
        z-index: 0;
    }
    .flowline {
        border-top: 1px solid var(--outline);
        margin: 1rem 0;
    }
    .flowline-arrow {
        position: absolute;
        left: 100%;
        top: 1rem;
        transform: translateY(-50%);
        height: .75rem;
    }
    .flow-canvas {
        padding: 1rem;
        padding-top: 3rem;
        display: flex;
        align-items: start;
        overflow: auto;
    }
</style>