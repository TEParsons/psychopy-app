<script>
    import { active_tab, n_tabs } from './globals.js'

    export let id;
    export let title;
    export let icon;
    export let active=false;
    
    // iterate number of tabs
    n_tabs.set($n_tabs + 1)

    if (active) {
        active_tab.set(id)
    }

    function on_tab() {
        active_tab.set(this.htmlFor)
    }
</script>

<label for={id} class="notebook-tab {$active_tab === id ? "active" : ""}" on:click={on_tab} >
    {#if icon}
    <img src={icon} alt=""/>
    {/if}
    {title}
</label>
{#if $active_tab === id}
<div class=notebook-page id={id}>
    <slot></slot>
</div>
{/if}

<style>
    .notebook-tab {
        grid-row-start: tabs;
        background-color: var(--mantle);
        border: none;
        padding: .25rem;
        text-align: center;
        z-index: 0;
    }
    .notebook-tab:hover {
        background-color: var(--crust);
    }
    .notebook-page {
        display: grid;
        grid-row-start: page;
        grid-column-end: span var(--n-tabs);
        padding: .5rem;
        box-sizing: border-box;
        background-color: var(--base);
        z-index: 1;
    }
    .notebook-tab.active {
        border-bottom: none;
        background-color: var(--base);
        z-index: 2;
    }
</style>