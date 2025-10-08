<script>
    import { getContext } from "svelte";

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable(),
        validate = (param) => !Array.isArray(param.allowedVals) || param.allowedVals.includes(param.val)
    } = $props()

    let current = getContext("current")

    let options = $derived.by(() => {
        let output = [];

        // iterate through routines
        for (let [name, rt] of Object.entries(current.experiment.routines)) {
            if (param.allowedVals.includes(rt.tag)) {
                output.push(name)
            }
        }

        return output
    })
</script>

<select 
    class=param-validator-input
    disabled={disabled || options.length === 0} 
    bind:value={param.val}
    style:color={valid.state ? "inherit" : "var(--red)"}
>
    <option
        value=""
        selected={param.val === ""}
    >Do not validate</option>
    {#each options as option}
        <option 
            value={option} 
            selected={param.val === option}
        >{option}</option>
    {/each}
</select>

<style>
    .param-validator-input {
        flex-grow: 1;
    }
</style>
