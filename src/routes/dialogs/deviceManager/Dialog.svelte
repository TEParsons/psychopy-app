<script>
    import Button from "$lib/utils/buttons/Button.svelte";
    import { Dialog } from "$lib/utils/dialog";
    import { ParamsNotebook } from "$lib/utils/paramCtrls";
    import { setContext } from "svelte";
    import DeviceDetails from "./DeviceDetails.svelte";
    import DeviceProfiles from "./devices.json";
    import { Listbook } from "$lib/utils/notebook";

    let {
        /** @bindable @type {boolean} State controlling when this dialog is shown */
        shown=$bindable()
    } = $props()

    let devices = $state({
        current: undefined,
        all: DeviceProfiles
    })

    setContext("devices", devices)
</script>


<Dialog
    id="device-manager"
    title="Device manager"
    buttons={{
        OK: () => {},
        APPLY: () => {},
        CANCEL: () => {},
        HELP: ""
    }}
    shown={shown}
>
    <div class=container>
        <Listbook>
            {#each Object.values(devices.all) as device}
                <DeviceDetails
                    device={device}
                ></DeviceDetails>
            {/each}
        </Listbook>
    </div>
</Dialog>

<style>
    .container {
        padding: 1rem;
    }
</style>