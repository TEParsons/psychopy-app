<script>
    import { devices, python } from "$lib/globals.svelte";
    import { DeviceManagerDialog } from "$lib/dialogs/deviceManager"
    import { CompactButton } from "$lib/utils/buttons";

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
        // if param.val isn't in options, add it
        if (param.val !== "" && !output.includes(param.val)) {
            output.push($state.snapshot(param.val))
        }

        return output
    })

    let showDialog = $state.raw(false)
</script>


<select 
    class=param-device-input
    disabled={disabled || options.length === 0} 
    bind:value={param.val}
    style:color={valid.state ? "inherit" : "var(--red)"}
>
    <option
        value=""
        selected={param.val === ""}
    >Default</option>
    {#each options as option}
        <option 
            value={option} 
            selected={param.val === option}
        >{option}</option>
    {/each}
</select>

{#if python}
    <CompactButton
        icon="icons/btn-devices.svg"
        onclick={(evt) => showDialog = true}
    />

    <DeviceManagerDialog
        bind:shown={showDialog}
    />
{/if}


<style>
    .param-device-input {
        flex-grow: 1;
    }
</style>