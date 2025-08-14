<script>
    import { Dialog } from "$lib/utils/dialog";
    import { setContext } from "svelte";
    import DeviceDetails from "./DeviceDetails.svelte";
    import DeviceProfiles from "./devices.json";
    import { AddPageButton, Listbook, NotebookPage } from "$lib/utils/notebook";
    import { Device } from "$lib/experiment.svelte";
    import AddDeviceDialog from "./addDevice/AddDeviceDialog.svelte";

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

    let showAddDeviceDialog = $state.raw(false)

    let valid = $state({})

    let btnsDisabled = $derived({
        OK: Object.values(valid).some(
            (val) => !val.state
        ),
        APPLY: Object.values(valid).some(
            (val) => !val.state
        )
    })
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
    buttonsDisabled={btnsDisabled}
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
                    bind:valid={valid}
                ></DeviceDetails>
            </NotebookPage>
            {/each}
            <AddPageButton
                callback={(evt) => showAddDeviceDialog = true}
                label="+ Add device"
            ></AddPageButton>
        </Listbook>
    </div>

    <AddDeviceDialog
        bind:shown={showAddDeviceDialog}
    ></AddDeviceDialog>
</Dialog>

<style>
    .container {
        padding: 1rem;
    }
</style>