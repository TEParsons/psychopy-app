<script>
    import { Dialog } from "$lib/utils/dialog";
    import DeviceDetails from "./DeviceDetails.svelte";
    import { ButtonTab, Listbook, NotebookPage } from "$lib/utils/notebook";
    import { Device } from "$lib/experiment.svelte";
    import { devices } from "$lib/globals.svelte";
    import AddDeviceDialog from "./addDevice/AddDeviceDialog.svelte";

    let {
        /** @bindable @type {boolean} State controlling when this dialog is shown */
        shown=$bindable()
    } = $props()

    // track selected device
    let currentDevice = $state.raw(undefined)

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

    async function openDevicesFile(evt) {
        // get file handle from system dialog
        let handle = await window.showOpenFilePicker({
            types: [{
                description: "PsychoPy Devices",
                accept: {
                    "application/json": [".json"]
                }
            }]
        });
        // get file blob from handle
        let file = await handle[0].getFile();
        // get data from JSON text
        let deviceData = JSON.parse(
            await file.text()
        )
        // set data
        devicesFromJSON(deviceData)

        console.log(`Loaded devices from ${file.name}:`, deviceData);
    }

    async function saveDevicesFile(evt) {
        // stringify devices
        let content = {};
        for (let [key, device] of Object.entries(devices)) {
            content[key] = device.toJSON();
        }
        content = JSON.stringify(content, null, 4)
        // open a file picker
        let handle = await window.showSaveFilePicker({
            types: [{
                description: "PsychoPy Devices",
                accept: {
                    "application/json": [".json"]
                }
            }],
            suggestedName: "devices.json"
        });
        // create file object
        let file = await handle.createWritable();
        // write to file
        file.seek(0);
        file.write(content);
        file.close();
    }

    function devicesFromJSON(deviceData) {
        // reset
        Object.keys(devices).forEach((key) => delete devices[key])
        currentDevice = undefined
        // add each device from the JSON as an object
        for (let [key, dev] of Object.entries(deviceData)) {
            // substitute deviceLabel for name
            if ("deviceLabel" in dev.params) {
                dev.params.name = dev.params.deviceLabel;
                delete dev.params.deviceLabel
            }
            // populate
            dev['tag'] = dev['__name__']
            devices[key] = new Device(dev['tag'], dev.profile);
            devices[key].fromJSON(dev)
            // select if nothing selected yet
            if (currentDevice === undefined) {
                currentDevice = devices[key]
            }
        }
    }
</script>


<Dialog
    id="device-manager"
    title="Device manager"
    buttons={{
        OK: () => {},
        APPLY: () => {},
        EXTRA: {
            Export: saveDevicesFile
        },
        CANCEL: () => {},
        HELP: ""
    }}
    buttonsDisabled={btnsDisabled}
    bind:shown={shown}
>
    <div class=container>
        <Listbook>
            {#each Object.entries(devices) as [key, device]}
                <NotebookPage
                    bind:selected={
                        () => {return currentDevice === device},
                        (value) => {currentDevice = device}
                    }
                    label={device.name} 
                    data={device}
                    close={(evt) => delete devices[key]}
                >
                    <DeviceDetails
                        device={device}
                        bind:valid={valid}
                    ></DeviceDetails>
                </NotebookPage>
            {/each}
            <!-- placeholder page -->
            {#if Object.keys(devices).length === 0}
            <NotebookPage
                label=""
                selected
            >
                <div class=placeholder-page>
                    <p>No devices have been setup.</p>
                    <p>Click "Add device" to add a new device, or import devices from a .json file.</p>
                </div>
            </NotebookPage>
            {/if}
            <ButtonTab
                callback={(evt) => showAddDeviceDialog = true}
                label="+ Add device"
            ></ButtonTab>
            <ButtonTab
                callback={openDevicesFile}
                label="⭱ Import devices"
                tooltip="Import devices from a .json file"
            ></ButtonTab>
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
    .placeholder-page {
        padding: 0 1rem;
        width: 30rem;
        color: var(--outline)
    }
</style>