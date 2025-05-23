<script>
    import { derived } from 'svelte/store';
    import { onMount, onDestroy, getContext } from 'svelte';

    /** @prop @type {String} Label for this page's tab */
    export let label;
    /** @prop @type {String|undefined} Path to an icon for this page's tab */
    export let icon = undefined;
    /** @prop @type {any} Arbitrary data relating to this page */
    export let data = {};

    /** @public @type {{tab: HTMLButtonElement|undefined, page: HTMLDivElement|undefined}} Handles of the HTML elements corresponding to this component, object can be supplied or bound */
    export const handles = {
        tab: undefined, 
        page: undefined,
    };

    /** @private @type {import("svelte/store").Writable<HTMLButtonElement|undefined>} Whichever tab within a notebook is currently active */
    let activeTab = getContext("activeTab");
    /** @private @type {import("svelte/store").Readable<boolean>}  Is this page's tab the active tab? */
    let active = derived(activeTab, (value) => {
        return value !== undefined && value === handles.tab
    });
    /** @private @type {import("svelte/store").Writable<Array<HTMLButtonElement|undefined>>} All tabs within a notebook */
    let allTabs = getContext("tabs");
    /** @private @type {Array<any>} All data within a notebook, by tab */
    let allData = getContext("tabData");

    /**
     * On mount, register this page's tab and data with its parent notebook.
     */
    onMount(() => {
        // add this page to parent notebook's tabs array
        allTabs.update((value) => {
            value.push(handles.tab);
            return value
        })
        // add this page's data to parent notebook's data array
        allData.push(data)
        // if there's no current page yet, make this the current page
        if ($activeTab === undefined) {
            activeTab.set(handles.tab);
        }
    })
    /**
     * On unmount, remove this page's tab and data from its parent notebook.
     */
    onDestroy(() => {
        // get index for this tab
        let i = $allTabs.indexOf(handles.tab)
        // remove tab from tabs array
        allTabs.update((value) => {
            value.splice(i, 1);
            return value
        })
        // remove data from data array
        allData.splice(i, 1)
    })
</script>


<!-- tab button for this page -->
<button 
    bind:this={handles.tab}
    class="notebook-tab" 
    class:active={$active} 
    on:click={
        /** @param evt {MouseEvent} */
        (evt) => {
            activeTab.set(handles.tab)
        }
    }
>
    {#if icon}
    <img 
        src={icon} 
        alt="" 
    />
    {/if}
    {label}
</button>

<!-- page container for this page -->
{#if $active}
<div 
    bind:this={handles.page}
    class=notebook-page
>
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
        padding: .5rem .5rem 3rem .5rem;
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