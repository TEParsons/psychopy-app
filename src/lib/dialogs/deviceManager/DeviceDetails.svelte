<script>
    import { ParamsNotebook, ParamCtrl } from "$lib/paramCtrls";
    import DeviceProfile from "./DeviceProfile.svelte";

    let {
        device,
        valid=$bindable()
    } = $props()

    valid['name'] = {
        state: true,
        warnings: []
    }
</script>


<div class=device-details-pnl>
    
    <div class=notebook-container>
        <ParamsNotebook
            element={device}
            bind:valid={valid}
        />
        <DeviceProfile 
            profile={device.profile}
        />
    </div>
</div>

<style>
    .device-details-pnl {
        grid-row-start: start;
        grid-row-end: end;
        grid-column-start: details;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    .notebook-container {
        margin: -1rem;
        position: relative;
    }
</style>