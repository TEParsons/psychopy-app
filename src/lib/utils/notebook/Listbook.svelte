<script>
    import { setContext } from 'svelte';

    let {
        /** @prop @type {function} Function to execute when the page is changed */
        onselect=(index, data) => {},
        /** @interface @type {Array<HTMLElement>} Child elements of this notebook */
        children=undefined
    } = $props()

    let pages = $state({
        book: "listbook",
        current: undefined,
        add: false,
        all: [],
        data: []
    })

    setContext("siblings", pages)
    $effect(() => {
        onselect(pages.current, pages.data[pages.current])
    })

</script>

<div 
    class=listbook
    style:grid-template-rows="[start] repeat({pages.all.length + (pages.add ? 1 : 0)}, min-content) 1fr [end]"
>
    {@render children?.()}
    <div class=listbook-tab-filler></div>
</div>

<style>
    .listbook {
        display: grid;
        grid-template-columns: [tabs] max-content [pages] auto;
        gap: 0;
        justify-items: stretch;
        align-items: stretch;
        margin: auto;
        height: 100%;
    }
    .listbook-tab-filler {
        grid-column-start: tabs;
    }
</style>