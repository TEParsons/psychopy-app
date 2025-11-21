<script>
    import { CompactButton } from "$lib/utils/buttons";
    import { CodeOutput } from "$lib/utils/code";
    import { getContext } from "svelte";
    import { python } from "$lib/globals.svelte";
    import { run } from "svelte/legacy";

    let current = getContext("current");

    python.output.stdout.listen(
        (evt, message) => current.output.stdout += `${message}\n`
    )
    python.output.stderr.listen(
        (evt, message) => current.output.stdout += `${message}\n`
    )
</script>


<CodeOutput bind:value={current.output.stdout}>
    {#snippet ctrls()}
        <CompactButton
            icon="/icons/btn-clear.svg"
            onclick={evt => current.output.stdout = ""}
            tooltip="Clear stdout"
        />
    {/snippet}
</CodeOutput>