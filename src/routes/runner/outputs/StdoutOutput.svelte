<script>
    import { CompactButton } from "$lib/utils/buttons";
    import { CodeOutput } from "$lib/utils/code";
    import { getContext } from "svelte";
    import { python } from "$lib/globals.svelte";

    let current = getContext("current");

    function subscribeStdout() {
        python.output.stdout().then(resp => {
            current.output.stdout += `${resp}\n`
            subscribeStdout()
        })
    }
    subscribeStdout()
    function subscribeStderr() {
        python.output.stderr().then(resp => {
            current.output.stdout += `${resp}\n`
            subscribeStderr()
        })
    }
    subscribeStderr()
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