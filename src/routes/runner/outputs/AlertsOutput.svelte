<script>
    import { CompactButton } from "$lib/utils/buttons";
    import { CodeOutput } from "$lib/utils/code";
    import { getContext } from "svelte";

    let current = getContext("current")
</script>


<CodeOutput bind:value={current.output.alerts}>
    {#snippet ctrls()}
        <CompactButton
            icon="icons/btn-clear.svg"
            onclick={evt => current.output.alerts = ""}
            tooltip="Clear alerts"
        />
    {/snippet}
</CodeOutput>