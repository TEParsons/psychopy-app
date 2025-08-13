<script>
    import { setContext } from 'svelte';
    import Tooltip from '../tooltip/Tooltip.svelte';

    let {
        /** @prop @type {function} Function to execute when the page is changed */
        onselect=(index, data) => {},
        /** @prop @type {function|undefined} Function to add a new tab (setting this will show the 
         * add button) */
        add=undefined,
        /** @prop @type {string|undefined} Tooltip when hovered over add button */
        addTooltip=undefined,
        /** @interface @type {Array<HTMLElement>} Child elements of this notebook */
        children=undefined
    } = $props()

    let pages = $state({
        book: "notebook",
        current: undefined,
        add: false,
        all: [],
        data: []
    })

    setContext("siblings", pages)
    $effect(() => {
        onselect(pages.current, pages.data[pages.current])
    })

    let addHovered = $state.raw(false)

</script>

<div 
    class=notebook
    style:grid-template-columns="[start] repeat({pages.all.length + (pages.add ? 1 : 0)}, min-content) 1fr [end]"
>
    {@render children?.()}
    <div class=notebook-tab-filler></div>
</div>

<style>
    .notebook {
        display: grid;
        grid-template-rows: [tabs] max-content [pages] auto;
        gap: 0;
        justify-items: start;
        align-items: stretch;
        margin: auto;
        height: 100%;
    }
    .notebook-tab-filler {
        grid-row-start: tabs;
    }
</style>