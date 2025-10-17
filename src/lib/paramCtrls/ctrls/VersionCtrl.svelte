<script>
    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @interface */
        ...attachments
    } = $props()

    function validateVersion(valid) {
        valid.value = param.val in options || param.val === ""
    }
    
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
    style:color={param.valid.value ? "inherit" : "var(--red)"}
    {@attach element => param.registerValidator("version", validateVersion, 0)}
    {...attachments}
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