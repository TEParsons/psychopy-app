<script>
    import { getContext } from "svelte";

    let {
        node,
        data,
        level
    } = $props();

    let siblings = getContext("siblings");
    let handle = $state.raw();
</script>

<button 
    class=tree-node
    bind:this={handle}
    style:padding-left="{0.5 + level/2}rem"
    onclick={evt => {
        siblings.selected = handle;
        siblings.onselect(evt, handle, data)
    }}
    ondblclick={evt => {
        siblings.selected = handle;
        siblings.onactivate(evt, handle, data)
    }}
    class:selected={siblings.selected === handle}
>
    {node.label}
</button>

<style>
    .tree-node {
        text-align: left;
        padding: .25rem;
        background-color: transparent;
    }
    .selected {
        background-color: var(--mantle);
    }
</style>