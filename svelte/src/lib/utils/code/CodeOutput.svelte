<script>
    import CompactButton from "../buttons/CompactButton.svelte";

    let {
        value=$bindable(),
        /** @interface */
        ctrls=undefined
    } = $props()
</script>

<div class=code-output>
    <pre>
        {#each value.split("\n") as line}
            <code>{line}</code>
        {/each}
    </pre>
    {#if ctrls}
        <div class=ctrls>
            {@render ctrls()}
            
        </div>
    {/if}
</div>

<style>
    .code-output {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: .5rem;
        height: 100%;
    }
    .ctrls {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
        padding: .5rem;
        gap: .5rem;
        box-sizing: border-box;
        border-left: 1px solid var(--overlay);
        flex-grow: 0;
    }
    pre {
        display: flex;
        flex-direction: column;
        align-items: start;
        overflow-y: auto;
        overflow-anchor: auto;
        margin: 0;
        flex-grow: 1;
    }
</style>