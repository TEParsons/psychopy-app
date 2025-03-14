<script>
    import { active_tab, n_tabs } from './globals.js'

    export let id;
    export let title;
    export let icon;
    export let active=false;
    
    // iterate number of tabs
    console.log(["BEFORE", $n_tabs])
    n_tabs.set($n_tabs + 1)
    console.log(["AFTER", $n_tabs])

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
        border-radius: .5rem .5rem 0 0;
    }
    .notebook-page {
        display: grid;
        grid-row-start: page;
        grid-column-end: span var(--n-tabs);
        padding: .5rem;
        box-sizing: border-box;
        margin: -1px -1rem 0 -.5rem;
        width: calc(100% + 1rem);
        background-color: var(--base);
        border: 1px solid var(--overlay);
        z-index: 1;
        border-radius: 0 0 .25rem .25rem;
    }
    .notebook-tab.active {
        border: 1px solid var(--overlay);
        border-bottom: none;
        background-color: var(--base);
        z-index: 2;
    }
</style>