<script>
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';

    /** @prop @type {boolean} Should this notebook be flush within its container? */
    export let flush = false;
    /** @prop @type {any} Arbitrary data associated with this notebook */
    export const data = {};

    /** @public @type {import("svelte/store").Writable<HTMLButtonElement|undefined>} The current tab's handle, store can be supplied or bound */
    export let activeTab = writable()
    setContext("activeTab", activeTab)
    /** @public @type {import("svelte/store").Writable<Array<HTMLButtonElement|undefined>>} This notebook's tab elements, array can be supplied or bound */
    export let tabs = writable([])
    setContext("tabs", tabs)
    /** @public @type {Array<object>} Arbitrary data to associated with each tab, array can be supplied or bound */
    export let tabData = [];
    setContext("tabData", tabData)
    /** @public @type {{notebook: HTMLButtonElement|undefined}} Handles of the HTML elements corresponding to this component, object can be supplied or bound */
    export const handles = {
        notebook: undefined, 
    };

</script>

<div 
    class=notebook 
    style:--n-tabs={$tabs.length} 
    class:flush={flush}
>
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