<script>
    import { getContext, onDestroy } from "svelte";
    import DeviceProfile from "../DeviceProfile.svelte";
    import { fade } from "svelte/transition";
    import { RadioButton } from "$lib/utils/buttons";

    let {
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
    <RadioButton
        label={device.deviceName}
        value={device}
    />
    <svg
        class=info
        style:opacity={hovered ? 1 : 0.25}
        onmouseenter={() => hovered = true}
        onmouseleave={() => hovered = false}
        onfocusin={() => hovered = true}
        onfocusout={() => hovered = false}
        role=none
    >
        <use xlink:href="icons/sym-info.svg" />
    </svg>
        

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
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .5rem;
    }
    .info {
        height: 1.5rem;
        width: 1.5rem;
        padding: .25rem;
        box-sizing: border-box;
        background-color: var(--outline);
        color: var(--base);
        border-radius: 50%;
    }
    .details-panel {
        position: absolute;
        top: calc(100% + 1rem);
        left: 1rem;
        z-index: 2;
        width: 35rem;
    }
</style>