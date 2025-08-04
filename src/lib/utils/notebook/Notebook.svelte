<script>
    import { setContext } from 'svelte';

    let {
        /** @prop @type {function} Function to execute when the page is changed */
        onselect=(index, data) => {},
        /** @prop @type {boolean} Should this notebook be flush within its container? */
        flush=false,
        /** @interface @type {Array<HTMLElement>} Child elements of this notebook */
        children
    } = $props()

    let pages = $state({
        current: undefined,
        all: [],
        data: []
    })

    setContext("siblings", pages)
    $effect(() => {
        onselect(pages.current, pages.data[pages.current])
    })

</script>

<div 
    class=notebook
    style:grid-template-columns="repeat({pages.all.length}, min-content) 1fr"
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