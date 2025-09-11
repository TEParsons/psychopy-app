<script>
    import { getContext, onDestroy } from "svelte";
    import DeviceProfile from "../DeviceProfile.svelte";
    import { fade } from "svelte/transition";

    let {
        key,
        device
    } = $props()

    let selected = getContext("selected");

    let hovered = $state.raw(false)

    onDestroy(() => {
        // clear selected device if selected and destroyed
        if (selected.device === device) {
            selected.device = undefined;
        }
    })
</script>

<div
    class=device-list-item
>
    <input 
        id="device-{key}"
        type="radio" 
        name="device" 
        value={key}
        onclick={() => selected.device = device}
    />
    <label 
        for="device-{key}"
        onmouseenter={() => hovered = true}
        onmouseleave={() => hovered = false}
        onfocusin={() => hovered = true}
        onfocusout={() => hovered = false}
        role=none
    >
        {device.deviceName}
    </label>
    {#if hovered}
        <div 
            class=details-panel
            transition:fade
        >
            <DeviceProfile
                profile={device}
            ></DeviceProfile>
        </div>
    {/if}
    
</div>

<style>
    .device-list-item {
        position: relative;
    }
    .details-panel {
        position: absolute;
        top: calc(100% + 1rem);
        left: 1rem;
        z-index: 2;
        width: 35rem;
    }
</style>