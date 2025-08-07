<script>
    let {
        param,
        validate = (param) => !Array.isArray(param.allowedVals) || param.allowedVals.includes(param.val)
    } = $props()


    // construct options live from the param's allowedVals and allowedLabels attributes
    let options = $derived.by(() => {
        let output = {};
        // if either allowed labels or values are a Python function, execute it
        if (typeof param.allowedVals === "string" && param.allowedVals.startsWith("python:///")) {
            // placeholder: include raw value
            param.allowedVals = [param.allowedVals]
        }
        if (typeof param.allowedLabels === "string" && param.allowedLabels.startsWith("python:///")) {
            // placeholder: leave blank
            param.allowedVals = [param.allowedVals]
        }
        // if no allowed labels, use allowed values
        if (!param.allowedLabels) {
            param.allowedLabels = param.allowedVals;
        }
        // if no allowed values, use allowed labels
        if (!param.allowedVals) {
            param.allowedVals = param.allowedLabels;
        }
        // if choice isn't in allowedVals, add it to the ctrl
        if (Array.isArray(param.allowedVals) && !param.allowedVals.includes(param.val)) {
            output[param.val] = param.val;
        }
        // if no allowed values or labels, there's no options
        if (!param.allowedVals && !param.allowedLabels) {
            return output;
        }
        // add allowed vals & labels to options
        for (let i in param.allowedVals) {
            output[param.allowedVals[i]] = param.allowedLabels[i];
        }
        
        return output
    })
    
    let isValid = $derived(validate(param))
    
</script>

<select 
    class=param-choice-input
    disabled={param.allowedVals.length == 1} 
    bind:value={param.val}
    style:color={isValid ? "inherit" : "var(--red)"}
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
