<script>
    import { derived, readable } from 'svelte/store';
    import { onMount, onDestroy, getContext } from 'svelte';

    export let title;
    export let icon = undefined;

    let tab;

    // for working out if this tab is active
    let activeTab = getContext("activeTab")
    let active = derived(activeTab, (value) => {return value === tab && value !== undefined})
    // for counting number of tabs (necessary for spacing on parent)
    let tabs = getContext("tabs")

    function onClick() {
        activeTab.set(tab)
    }

    onMount(() => {
        // add to tabs array
        tabs.update((value) => {
            value.push(tab);
            return value
        })
        // if no current page yet, make this current
        if ($activeTab === undefined) {
            activeTab.set(tab);
        }
    })
    onDestroy(() => {
        tabs.update((value) => {
            value.splice(
                value.indexOf(tab), 1
            );
            return value
        })
    })
</script>

<button 
    bind:this={tab}
    class="notebook-tab" 
    class:active={$active} 
    on:click={onClick}
>
    {#if icon}
    <img src={icon} alt="" />
    {/if}
    {title}
</button>

{#if $active}
<div class=notebook-page>
    <slot></slot>
</div>
{/if}

<style>
    button.notebook-tab {
        grid-row-start: tabs;
        background-color: var(--crust);
        border: none;
        border-radius: 0;
        padding: .25rem 1rem;
        margin: 0;
        text-align: center;
        z-index: 0;
    }
    button.notebook-tab:hover {
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
    button.notebook-tab.active {
        border-bottom: none;
        background-color: var(--base);
        z-index: 2;
        border: 1px solid var(--overlay);
        border-bottom: none;
        margin-bottom: -1px;
    }
</style>