<script>
    import { ParamsNotebook, ParamCtrl } from "$lib/utils/paramCtrls";
    import DeviceProfile from "./DeviceProfile.svelte";

    let {
        device
    } = $props()
</script>


<div class=device-details-pnl>
    <div class=name-container>
        <ParamCtrl
            name="name"
            param={device.params['name']}
        ></ParamCtrl>
    </div>
    <DeviceProfile 
        profile={device.profile}
    ></DeviceProfile>
    <ParamsNotebook
        element={device}
        hideParams={["name"]}
    >
    </ParamsNotebook>
</div>

<style>
    .device-details-pnl {
        grid-row-start: start;
        grid-row-end: end;
        grid-column-start: details;

        display: flex;
        flex-direction: column;
        pad: .5rem;
    }
    .name-container {
        padding: 1rem;
    }
</style>