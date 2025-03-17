<script>
    import { theme } from '../../globals.js';
    import { FlowLoop } from '../utils.js'
    import RoutineNode from './Routine.svelte';

    export let element;
</script>

<div class=loop id=loop-{element.name}>
    {#if element}
    <label for=loop-{element.name}>{element.name}</label>
    {/if}
    <img class=loop-arrow src="/icons/{$theme}/sym-arrow-up.svg" alt="<"/>
    {#if element}
    {#each element.routines as rt}
    {#if rt instanceof FlowLoop}
    <svelte:self element={rt}></svelte:self>
    {:else}
    <RoutineNode element={rt}></RoutineNode>
    {/if}
    {/each}
    {/if}
</div>

<style>
    .loop {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: start;
        gap: 2rem;
        border: 1px solid var(--outline);
        border-radius: 1rem;
        padding: 2rem;
        padding-top: 0;
    }
    .loop label {
        position: absolute;
        line-height: 1rem;
        bottom: calc(-1em - 2px);
        left: 50%;
        transform: translateX(-50%);
        padding: .5rem 1rem;
        background-color: var(--outline);
        color: var(--outline-text);
        border-radius: 1rem;
    }
    .loop-arrow {
        width: .75rem;
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateX(calc(50% - .5px)) translateY(-50%);
    }

    .loop.flow {
        border: none;
    }
    .loop.flow > .loop-arrow {
        display: none;
    }
</style>