<script>
    import { setContext } from "svelte";
    import TreeBranch from "./TreeBranch.svelte";
    import TreeNode from "./TreeNode.svelte";

    let {
        data,
        onselect=(evt, handle, data) => {},
        onactivate=(evt, handle, data) => {}
    } = $props();

    let level = 0;

    let nodes = $state({
        selected: undefined,
        onselect: onselect,
        onactivate: onactivate
    });
    setContext("siblings", nodes)
</script>

<div 
    class=tree-ctrl
    onfocusout={evt => nodes.selected = undefined}
>
    {#each data as node}
        {#if "children" in node}
            <TreeBranch branch={node} level={level} />
        {:else}
            <TreeNode node={node} data={node.data} level={level} />
        {/if}
    {/each}
</div>

<style>
    .tree-ctrl {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        background-color: var(--base);
        flex-grow: 1;
        padding-bottom: 1rem;
        box-sizing: border-box;
    }
</style>