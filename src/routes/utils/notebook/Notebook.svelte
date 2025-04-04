<script>
    import { onMount } from 'svelte';
    import { n_tabs } from './globals.js';

    export let id;

    export let handle;
    export let flush = false;

</script>

<div id={id} class=notebook style="--n-tabs: {$n_tabs}" class:flush={flush} bind:this={handle}>
    <slot></slot>
</div>

<style>
    .notebook {
        display: grid;
        grid-template-rows: [tabs] min-content [page] 1fr;
        grid-template-columns: repeat(var(--n-tabs), min-content) 1fr;
        z-index: 1;
        margin: auto;
        padding: 1rem;
        box-sizing: border-box;
        position: relative;
        height: stretch;
        width: fit-content;
        max-height: 100%;
    }
    .notebook.flush {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }
</style>