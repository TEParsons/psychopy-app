<script>
    import { optionsFromParam } from "./utils.js";

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable(),
        validate = (param) => !Array.isArray(param.allowedVals) || param.allowedVals.includes(param.val)
    } = $props()
</script>

<svelte:boundary>
    {#snippet pending()}
        <div
            class=param-choice-placeholder
        >
            Loading options...
        </div>
    {/snippet}
    <select 
        class=param-choice-input
        disabled={disabled || param.allowedVals.length == 1} 
        bind:value={param.val}
        style:color={valid.state ? "inherit" : "var(--red)"}
    >
        {#each await optionsFromParam(param) as [val, label]}
            <option 
                value={val} 
                selected={param.val === val}
            >{label}</option>
        {/each}
    </select>
</svelte:boundary>

<style>
    .param-choice-placeholder {
        border: 1px solid var(--overlay);
        padding: .5rem 1rem;
        border-radius: .25rem;
        flex-grow: 1;
        color: var(--outline);
    }
    .param-choice-input {
        flex-grow: 1;
    }
</style>
