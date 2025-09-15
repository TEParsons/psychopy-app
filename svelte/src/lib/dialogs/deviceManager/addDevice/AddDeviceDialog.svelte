<script>
    import { Dialog } from "$lib/utils/dialog";
    
    import { CompactButton, PanelButton, RadioGroup } from "$lib/utils/buttons";
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

    let timeout = $state.raw(60000)
    let availableDevices = $state.raw(
        python.liaison.send({
            command: "run",
            args: [
                "psychopy.hardware.manager:DeviceManager.getAvailableDevices"
            ]
        }, timeout)
    )
    async function updateAvailableDevices() {
        availableDevices = python.liaison.send({
            command: "run",
            args: [
                "psychopy.hardware.manager:DeviceManager.getAvailableDevices"
            ]
        }, timeout)
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
    onopen={evt => {
        // no name
        param.val = ""
        // nothing selected
        selected.device = undefined;
        // close all panels
        for (let key in panelsOpen) {
            panelsOpen[key] = false;
        }
    }}
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
            class=label
            style:margin-bottom="-.5rem"
        >
            <span style:flex-grow={1}>Available devices</span>
            <CompactButton
                icon="icons/btn-refresh.svg"
                tooltip=Refresh
                onclick={updateAvailableDevices}
            />
        </div>
        <div class=devices-list>
            {#await availableDevices}
                <div class=loading-msg>Scanning devices...</div>
            {:then result}
                <RadioGroup
                    bind:value={selected.device}
                >
                    {#each Object.entries(result) as [deviceType, profiles]}
                        <PanelButton
                            label={titleCase(className(deviceType))}
                            bind:open={panelsOpen[deviceType]}
                        >
                            <div class=device-category>
                                {#each Object.values(profiles) as device}
                                    <DeviceListItem
                                        device={device}
                                    />
                                {/each}
                            </div>
                        </PanelButton>
                    {/each}
                </RadioGroup>
            {:catch error}
                    <div class=timeout-msg>
                        <p>Getting available devices took longer than expected.</p>
                        <pre>
{error}
                        </pre>
                        
                        <p>Try again with a longer wait time (in milliseconds)?</p>
                        <div class=retry>
                            <input 
                                type=number 
                                style:flex-grow={1}
                                bind:value={timeout} 
                            />
                            <CompactButton
                                icon="icons/btn-refresh.svg"
                                tooltip=Retry
                                onclick={updateAvailableDevices}
                            />
                        </div>
                    </div>
            {/await}
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
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: 1rem;
        padding-top: .5rem;
    }
    .loading-msg {
        padding: 1rem;
    }

    .timeout-msg {
        padding: 1rem;
    }
    .timeout-msg pre {
        overflow: auto;
    }
    .timeout-msg .retry {
        display: flex;
        flex-direction: row;
        gap: .5rem;
    }

    .label {
        display: flex;
        flex-direction: row;
        gap: .5rem;
        align-items: end;
    }
</style>