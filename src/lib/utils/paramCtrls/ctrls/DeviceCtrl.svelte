<script>
    import { devices } from "$lib/globals.svelte";
    import { DeviceManagerDialog } from "$lib/dialogs/deviceManager"

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable(),
        validate = (param) => !Array.isArray(param.allowedVals) || param.allowedVals.includes(param.val)
    } = $props()

    let options = $derived.by(() => {
        let output = [];
        // iterate through devices
        for (let [name, device] of Object.entries(devices)) {
            // iterate through allowed device classes
            for (let target of param.allowedVals) {
                // if device is allowed, add it
                if (String(target).endsWith(device.tag)) {
                    output.push(name);
                }
            }
        }

        return output
    })

</script>


<select 
    class=param-device-input
    disabled={disabled || options.length === 0} 
    bind:value={param.val}
    style:color={valid.state ? "inherit" : "var(--red)"}
>
    {#each options as option}
        <option 
            value={option} 
            selected={param.val === option}
        >{option}</option>
    {/each}
</select>

<style>
    .param-device-input {
        flex-grow: 1;
    }
</style>