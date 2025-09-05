<script>
    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable(),
        validate = (param) => !Array.isArray(param.allowedVals) || param.allowedVals.includes(param.val)
    } = $props()

    
    // construct options live from the param's allowedVals and allowedLabels attributes
    let options = $derived.by(async () => {
        // start off with just "latest"
        let output = [
            ["", "latest"]
        ]
        // replace param allowedVals with versions from GitHub
        let resp = await fetch(
            `https://api.github.com/repos/${param.allowedVals}/releases`, 
            {method: "GET"}
        );
        // add GitHub versions
        for (let ver of await resp.json()) {
            output.push([ver.tag_name, ver.tag_name])
        }

        return output
    })
</script>

<select 
    class=param-version-input
    disabled={disabled || param.allowedVals.length == 1} 
    bind:value={param.val}
    style:color={valid.state ? "inherit" : "var(--red)"}
>
    {#await options}
        <option value="">Fetching versions from GitHub...</option>
    {:then options}
        {#each options as [val, label]}
            <option 
                value={val} 
                selected={param.val === val}
            >{label}</option>
        {/each}
    {/await}
</select>

<style>
    .param-version-input {
        flex-grow: 1;
    }
</style>