<script>
    import { n_tabs } from './globals.js';
    import { onMount, onDestroy } from 'svelte';

    export let id;
    export let title;
    export let icon = undefined;
    export let activeTracker;

    function onClick() {
        activeTracker.set(id)
    }

    onMount(() => {
        $n_tabs += 1;
        // if no current page yet, make this current
        if ($activeTracker === undefined) {
            activeTracker.set(id);
        }
    })
    onDestroy(() => {$n_tabs -= 1})
</script>

<label for={id} class="notebook-tab" class:active={$activeTracker === id} on:click={onClick}>
    {#if icon}
    <img src={icon} alt="" />
    {/if}
    {title}
</label>
{#if $activeTracker === id}
<div class=notebook-page id={id}>
    <slot></slot>
</div>
{/if}

<style>
    .notebook-tab {
        grid-row-start: tabs;
        background-color: var(--crust);
        border: none;
        padding: .25rem 1rem;
        text-align: center;
        z-index: 0;
    }
    .notebook-tab:hover {
        background-color: var(--mantle);
    }
    .notebook-page {
        position: relative;
        height: auto;
        overflow-y: auto;
        width: auto;
        overflow-x: auto;

        grid-row-start: page;
        grid-column-end: span calc(var(--n-tabs) + 1);
        padding: .5rem;
        box-sizing: border-box;
        background-color: var(--base);
        z-index: 1;
        border: 1px solid var(--overlay);
    }
    .notebook-tab.active {
        border-bottom: none;
        background-color: var(--base);
        z-index: 2;
        border: 1px solid var(--overlay);
        border-bottom: none;
        margin-bottom: -1px;
    }
</style>