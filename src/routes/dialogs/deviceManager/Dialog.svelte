<script>
    import Button from "$lib/utils/buttons/Button.svelte";
    import { Dialog } from "$lib/utils/dialog";
    import { ParamsNotebook } from "$lib/utils/paramCtrls";
    import { setContext } from "svelte";
    import DeviceDetails from "./DeviceDetails.svelte";
    import DeviceProfiles from "./devices.json";
    import { Listbook, NotebookPage } from "$lib/utils/notebook";
    import { Device } from "$lib/experiment.svelte";

    let {
        /** @bindable @type {boolean} State controlling when this dialog is shown */
        shown=$bindable()
    } = $props()

    // state in which to store devices
    let devices = $state({
        current: undefined,
        all: {}
    })
    // add each device from the JSON as an object
    for (let [key, dev] of Object.entries(DeviceProfiles)) {
        dev['tag'] = dev['__name__']
        devices.all[key] = new Device(dev['tag'], dev.profile);
        devices.all[key].fromJSON(dev)
    }

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
            {#each Object.entries(devices.all) as [key, device]}
            <NotebookPage
                bind:selected={
                    () => {return devices.current === device},
                    (value) => {devices.current = device}
                }
                label={device.name} 
                data={device}
                close={(evt) => delete devices.all[key]}
            >
                <DeviceDetails
                    device={device}
                ></DeviceDetails>
            </NotebookPage>
            {/each}
        </Listbook>
    </div>
</Dialog>

<style>
    .container {
        padding: 1rem;
    }
</style>