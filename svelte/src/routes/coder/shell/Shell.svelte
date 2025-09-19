<script>
    import { python } from "$lib/globals.svelte.js";
    import { onMount } from "svelte";

    let {
        id
    } = $props()

    let output = $state({
        handle: undefined,
        content: []
    })

    let message = $state.raw("");
</script>

<div class=shell-ctrl>
    <pre
        bind:this={output.handle}
    >
        {#each output.content as line}
            <code>{line}</code>
        {/each}
    </pre>
    <input 
        type=text
        bind:value={message}
        onkeypress={evt => {
            if (evt.key === "Enter") {
                // send message
                let resp = python.shell.send(id, $state.snapshot(message))
                // clear ctrl
                message = ""
                // show resp
                resp.then(
                    resp => output.content.push(...resp)
                ).catch(
                    err => console.log(err)
                )
            }
        }}
    />
</div>

<style>
    pre {
        display: flex;
        flex-direction: column;
        align-items: start;
        overflow-y: auto;
        overflow-anchor: auto;
    }

    input {
        font-family: var(--mono);
    }

    .shell-ctrl {
        height: 100%;
        display: grid;
        grid-template-rows: 1fr min-content;
    }
</style>