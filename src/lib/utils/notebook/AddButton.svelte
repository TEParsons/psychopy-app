<script>
    import { getContext, onMount } from "svelte";
    import Tooltip from "../tooltip/Tooltip.svelte";

    let {
        callback,
        tooltip=undefined,
        label="+"
    } = $props()

    let hovered = $state.raw(false)

    let siblings = getContext("siblings")
    // tell parent that this button exists
    siblings.add = true
</script>


<button
    class=add-btn
    class:listbook={siblings.book === "listbook"}
    class:notebook={siblings.book === "notebook"}
    onclick={callback}
    onmouseenter={() => {hovered = true}}
    onmouseleave={() => {hovered = false}}
    onfocusin={() => {hovered = true}}
    onfocusout={() => {hovered = false}}
>
    {label}
    {#if tooltip}
        <Tooltip
            bind:shown={hovered}
            position="bottom"
        >
            {tooltip}
        </Tooltip>
    {/if}
</button>

<style>
    .add-btn {
        position: relative;
        color: var(--outline);
        transition: background .2s, color .2s;
        background-color: var(--crust);
        z-index: 2;
    }
    .add-btn:hover {
        color: var(--blue);
        background-color: var(--base);
    }

    .add-btn.notebook {
        grid-row-start: tabs;
        border-left: 1px solid var(--overlay);
        line-height: 1em;
    }

    .add-btn.listbook {
        grid-column-start: tabs;
        border-top: 1px solid var(--overlay);
        padding: 0.5rem;
    }
</style>