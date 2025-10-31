<script>
    import { getContext } from "svelte";
    import TreeBranch from "./TreeBranch.svelte";
    import TreeNode from "./TreeNode.svelte";
    import { Icon } from "$lib/utils/icons";

    let {
        branch,
        level
    } = $props();

    let siblings = getContext("siblings");
    let open = $state.raw(false);
    let handle = $state.raw();
</script>

<div 
    class=tree-branch
>
    <button
        class=label
        bind:this={handle}
        onclick={evt => {
            siblings.selected = handle;
            open = !open;
        }}
        class:selected={siblings.selected === handle}
        style:padding-left="calc({0.5 + level/2}rem)"
    >
        <Icon 
            src="/icons/sym-arrow-{open ? "down" : "right"}.svg"
            size=".5rem"
        />
        {branch.label}
    </button>
    {#if open}
        <div 
            class=children
        >
            {#each branch.children as node}
                {#if "children" in node}
                    <TreeBranch branch={node} level={level+1} />
                {:else}
                    <TreeNode node={node} level={level+1} />
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .label {
        padding: .25rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .5rem;
        width: 100%;
        background-color: transparent;
    }

    .children {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    .selected {
        background-color: var(--mantle);
    }
</style>