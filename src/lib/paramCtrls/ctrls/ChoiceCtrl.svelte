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


<select 
    class=param-choice-input
    disabled={disabled || param.allowedVals.length == 1} 
    bind:value={param.val}
    style:color={valid.state ? "inherit" : "var(--red)"}
>
    {#await optionsFromParam(param)}
        <option>Loading...</option>
    {:then options}
        {#each options as [val, label]}
            <option 
                value={val} 
                selected={param.val === val}
            >{label}</option>
        {/each}
    {:catch}
        <option 
            value={param.val} 
            selected
        >{param.val}</option>
    {/await}
</select>


<style>
    .param-choice-input {
        flex-grow: 1;
    }
</style>
