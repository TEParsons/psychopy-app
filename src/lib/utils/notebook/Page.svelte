<script>
    import { onMount, onDestroy, getContext } from 'svelte';

    let {
        /** @prop @type {String} Label for this page's tab */
        label,
        /** @prop @type {String|undefined} Path to an icon for this page's tab */
        icon=undefined,
        /** @binding Control whether this page is selected */
        selected=$bindable(),
        /** @prop @type {any} Arbitrary data relating to this page */
        data={},
        /** @interface @type {Array<HTMLElement>} Contents of this page */
        children
    } = $props()

    // get context
    let siblings = getContext("siblings")
    // get own handle
    let handle;
    // get own index
    let index = $derived(siblings.all.indexOf(handle))

    // update parent on selection
    $effect(() => {
        if (selected) {
            siblings.current = index;
        }
    })
    
    // register self with notebook on mount
    onMount(() => {
        siblings.all.push(handle)
        siblings.data.push(data)
        // show self if no page is shown
        if (siblings.current === undefined) {
            siblings.current = index;
            selected = true;
        }
    })
    // unregister on destroy
    onDestroy(() => {
        if (siblings.all[index] !== undefined) {
            delete siblings.all[index]
        }
        if (siblings.data[index] !== undefined) {
            delete siblings.data[index]
        }
    })
</script>


<!-- tab button for this page -->
<button
    class="notebook-tab"
    class:current={selected}
    onclick={() => selected = true}
    ondragover={() => selected = true}
    bind:this={handle}
>
    {#if icon}
    <img 
        src={icon} 
        alt="" 
    />
    {/if}
    {label}
</button>
{#if selected}
    <div 
        class="notebook-page"
        style:grid-column-end="span {siblings.all.length + 1}"
    >
        {@render children?.()}
    </div>
{/if}


<style>
    .notebook-tab {
        grid-row-start: tabs;
        background: var(--crust) linear-gradient(transparent 0%, transparent 75%, rgba(0, 0, 0, 0.025) 100%);
        border: none;
        border-radius: 0;
        padding: .25rem 1rem;
        margin: 0;
        text-align: center;
        transition: background .2s;
        /* position within notebook */
        grid-row-start: tabs;
    }
    button.notebook-tab:hover {
        background-color: var(--mantle);
        background: var(--mantle) linear-gradient(transparent 0%, transparent 75%, rgba(0, 0, 0, 0.01) 100%);
    }
    .notebook-page {
        position: relative;
        height: auto;
        overflow-y: auto;
        width: 100%;
        overflow-x: auto;
        padding: .5rem .5rem 3rem .5rem;
        box-sizing: border-box;
        background-color: var(--base);
        z-index: 1;
        border: 1px solid var(--overlay);
        /* position within notebook */
        grid-row-start: pages;
    }
    .notebook-tab.current {
        border-bottom: none;
        background: var(--base);
        z-index: 2;
        border: 1px solid var(--overlay);
        border-bottom: none;
        margin-bottom: -1px;
    }
</style>