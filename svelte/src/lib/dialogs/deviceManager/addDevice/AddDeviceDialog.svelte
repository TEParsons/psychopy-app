<script>
    import { Dialog } from "$lib/utils/dialog";
    
    import { PanelButton } from "$lib/utils/buttons";
    import DeviceListItem from "./DeviceListItem.svelte";
    import { ParamCtrl } from "$lib/paramCtrls";
    import { Device, Param } from "$lib/experiment/experiment.svelte"
    import { onMount, setContext } from "svelte";
    import { devices, python } from "$lib/globals.svelte";

    let {
        shown=$bindable()
    } = $props()

    function titleCase(name) {
        name = name.replace("DeviceBackend", "");
        name = name.replace("Backend", "");
        name = name.replace(/(\w)([A-Z])/g, "$1 $2")

        return name;
    }
    function className(name) {
        return name.match(/(?<=\.)\w+$/)[0]
    }
    let selected = $state({
        device: undefined
    })
    setContext("selected", selected)

    let param = new Param("Device label")
    param.inputType = "name"

    let panelsOpen = $state({})

    let availableDevices = $state({
        pending: true,
        profiles: {}
    });

    /** 
     * Reset this dialog 
     */
    async function populate(evt) {
        // no name
        param.val = ""
        // nothing selected
        selected.device = undefined;
        // close all panels
        for (let key in panelsOpen) {
            panelsOpen[key] = false;
        }
        // get devices from Python
        let resp = await python.liaison.send({
            command: "run",
            args: [
                "DeviceManager.getAvailableDevices"
            ]
        }, 10000)
        // populate profiles array
        availableDevices.profiles = resp;
        // mark as done
        availableDevices.pending = false;
    }

    let validName = $state({
        state: false,
        warning: ""
    })
    let disableBtns = $derived({
        OK: !validName.state || !selected.device
    })

</script>

<Dialog
    id=add-device
    title="Add device..."
    bind:shown={shown}
    onopen={populate}
    buttons={{
        OK: (evt) => {
            // populate
            devices[param.val] = new Device(className(selected.device.deviceClass) + "Backend", selected.device.profile);
            devices[param.val].params['name'].val = param.val;
        },
        CANCEL: (evt) => {}
    }}
    buttonsDisabled={disableBtns}
>
    <div class=container>
        <ParamCtrl
            name={param.name}
            param={param}
            bind:valid={validName}
        ></ParamCtrl>
        <div 
            style:margin-bottom="-.5rem"
        >
            Available devices
        </div>
        <div class=devices-list>
            {#if !availableDevices.pending}
                {#each Object.entries(availableDevices.profiles) as [deviceType, profiles]}
                    <PanelButton
                        label={titleCase(className(deviceType))}
                        bind:open={panelsOpen[deviceType]}
                    >
                        <div class=device-category>
                            {#each Object.entries(profiles) as [key, device]}
                                <DeviceListItem
                                    key={key}
                                    device={device}
                                ></DeviceListItem>
                            {/each}
                        </div>
                    </PanelButton>
                {/each}
            {:else}
                <div class=loading-msg>Scanning devices...</div>
            {/if}
        </div>
    </div>
</Dialog>

<style>
    .container {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        height: 100%;
        box-sizing: border-box;
        width: 45rem;
    }
    .devices-list {
        background-color: var(--base);
        border: 1px solid var(--overlay);
        overflow-y: auto;
        padding-bottom: 10rem;
        height: 100%;
    }
    .device-category {
        padding: 1rem;
        padding-top: .5rem;
    }
    .loading-msg {
        padding: 1rem;
    }
</style>