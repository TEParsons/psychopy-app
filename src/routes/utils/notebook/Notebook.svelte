<script>
    import { onMount } from 'svelte';
    import { n_tabs } from './globals.js';

    export let id;

    export let handle;

</script>

<div id={id} class=notebook style="--n-tabs: {$n_tabs}" bind:this={handle}>
    <slot></slot>
</div>

<style>
    .notebook {
        display: grid;
        grid-template-rows: [tabs] min-content [page] 1fr;
        grid-template-columns: repeat(var(--n-tabs), min-content) 1fr;
        z-index: 1;
    }
</style>