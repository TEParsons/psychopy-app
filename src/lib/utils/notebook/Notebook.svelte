<script>
    import { onMount, setContext } from 'svelte';
    import { writable } from 'svelte/store';

    export let flush = false;
    export let activeTab = writable()
    setContext("activeTab", activeTab)
    export let tabs = writable([])
    setContext("tabs", tabs)
</script>

<div class=notebook style="--n-tabs: {$tabs.length}" class:flush={flush}>
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