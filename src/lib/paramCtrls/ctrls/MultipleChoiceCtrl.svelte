<script>
    import { optionsFromParam } from "./utils.js";

    let {
        param,
        valid=$bindable(),
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        validate = (param) => !Array.isArray(param.allowedVals) || !Array.isArray(param.val) || param.val.every((val) => param.allowedVals.includes(val))
    } = $props()


    // construct options live from the param's allowedVals and allowedLabels attributes
    let options = $derived(
        optionsFromParam(param)
    )

    $effect(() => {
        valid.state = validate(param)
    })
    
</script>

<div
    class=param-multi-choice-input
    style:color={valid.state ? "inherit" : "var(--red)"}
>
    {#each options as [val, label]}
        <input
            type=checkbox
            bind:checked={
                () => param.val.includes(val),
                (value) => {
                    if (value && !param.val.includes(val)) {
                        // if checked and value isn't in param, add it
                        param.val.push(val)
                    } else if (!value && param.val.includes(val)) {
                        // if unchecked and value is in param, remove it
                        param.val.splice(param.val.indexOf(val), 1)
                    }
                }
            }
            disabled={disabled}
        />
        {label}
    {/each}
</div>

<style>
    .param-multi-choice-input {
        flex-grow: 1;

        border: 1px solid var(--overlay);
        border-radius: .5rem;
        padding: .5rem;

        display: grid;
        grid-template-columns: [ctrls] 2rem [labels] 1fr;
        gap: .5rem;
        align-items: center;
    }
</style>
