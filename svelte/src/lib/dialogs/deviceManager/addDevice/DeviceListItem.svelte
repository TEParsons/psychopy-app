<script>
    import { getContext, onDestroy } from "svelte";
    import DeviceProfile from "../DeviceProfile.svelte";
    import { fade } from "svelte/transition";
    import { RadioButton } from "$lib/utils/buttons";
    import { Info } from "$lib/utils/tooltip";

    let {
        device,
        backend
    } = $props()

    let selected = getContext("selected");

    onDestroy(() => {
        // clear selected device if selected and destroyed
        if (selected.device?.device === device) {
            selected.device = undefined;
        }
    })
</script>

<div
    class=device-list-item
>
    <RadioButton
        label={device.deviceName}
        value={{
            device: device,
            backend: backend
        }}
    />
    <Info>
        <div 
            class=details-panel
            transition:fade
        >
            <DeviceProfile
                profile={device}
            ></DeviceProfile>
        </div>
    </Info>
    
</div>

<style>
    .device-list-item {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .5rem;
    }
    
    .details-panel {
        position: absolute;
        top: calc(100% + 1rem);
        left: 1rem;
        z-index: 2;
        width: 35rem;
        background-color: transparent;
        color: var(--text);
    }
</style>