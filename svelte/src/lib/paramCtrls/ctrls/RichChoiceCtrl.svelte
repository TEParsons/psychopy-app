<script>
    import { optionsFromParam } from "./utils.js"

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable()
    } = $props()

    let options = $state.raw([])

    $effect(() => {
        optionsFromParam(param).then(resp => options = resp)
    })
</script>

<div 
    class=param-rich-choice-ctrl
>
    {#await optionsFromParam(param)}
        Loading...
    {:then options}
        {#each options as [val, details]}
            <button
                class=rich-ctrl-item
                class:selected={param.val === val}
                onclick={(evt) => param.val = val}
            >
                <b>{details.label}</b>
                <p>{details.body}</p>
                {#if details.link}
                <a href={details.link}>{details.linkText}</a>
                {/if}
            </button>
        {/each}
    {:catch}
        Failed to load options.
    {/await}
</div>

<style>
    .param-rich-choice-ctrl {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        gap: .5rem;
        flex-grow: 1;
    }

    .rich-ctrl-item {
        padding: 1rem;
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        opacity: 80%;
        transition: opacity .2s border-color .2s background-color .2s;
        display: flex;
        flex-direction: column;
        align-items: start;
        text-align: left;
    }

    .rich-ctrl-item.selected,
    .rich-ctrl-item:hover {
        border-color: var(--blue);
        background-color: var(--base);
    }
    .rich-ctrl-item.selected {
        opacity: 100%;
    }
</style>