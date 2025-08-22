<script>
    import { getContext } from "svelte";
    import { optionsFromParam } from "./utils.js";

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable(),
        validate = (param) => !Array.isArray(param.allowedVals) || param.allowedVals.includes(param.val)
    } = $props()


    // construct options live from the param's allowedVals and allowedLabels attributes
    let options = $derived(
        optionsFromParam(param)
    )
</script>

<select 
    class=param-choice-input
    disabled={disabled || param.allowedVals.length == 1} 
    bind:value={param.val}
    style:color={valid.state ? "inherit" : "var(--red)"}
>
    {#each Object.entries(options) as [val, label]}
        <option 
            value={val} 
            selected={param.val === val}
        >{label}</option>
    {/each}
</select>

<style>
    .param-choice-input {
        flex-grow: 1;
    }
</style>
