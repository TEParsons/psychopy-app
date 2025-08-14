<script>
    import { Dialog } from "$lib/utils/dialog";
    
    import DeviceProfiles from "../devices.json";
    import { PanelButton } from "$lib/utils/buttons";
    import DeviceListItem from "./DeviceListItem.svelte";
    import { ParamCtrl } from "$lib/utils/paramCtrls";
    import { Param } from "$lib/experiment.svelte"
    import { setContext } from "svelte";

    let {
        shown=$bindable()
    } = $props()

    function titleCase(name) {
        name = name.replace("DeviceBackend", "");
        name = name.replace("Backend", "");
        name = name.replace(/(\w)([A-Z])/g, "$1 $2")

        return name;
    }

    let sortedProfiles = $derived.by(() => {
        let output = {};
        
        for (let [key, val] of Object.entries(DeviceProfiles)) {
            // make sure class key exists in output
            if (!(val.__name__ in output)) {
                output[val.__name__] = {}
            }
            // add device
            output[val.__name__][key] = val
        }

        return output
    })
    let selected = $state({
        device: undefined
    })
    setContext("selected", selected)

    let param = new Param("Device label")
    param.inputType = "name"

    let panelsOpen = $state({})

    /** Reset this dialog */
    export function clear(evt) {
        // nothing selected
        selected.device = undefined;
        // no name
        param.val = ""
        // close all panels
        for (let key in panelsOpen) {
            panelsOpen[key] = false;
        }
    }

    let disableBtns = $derived({
        OK: String(param.val).length === 0 || !selected.device
    })

</script>

<Dialog
    id=add-device
    title="Add device..."
    bind:shown={shown}
    onopen={clear}
    buttons={{
        OK: (evt) => {},
        CANCEL: (evt) => {}
    }}
    buttonsDisabled={disableBtns}
>
    <div class=container>
        <ParamCtrl
            name={param.name}
            param={param}
        ></ParamCtrl>
        <div 
            style:margin-bottom="-.5rem"
        >
            Available devices
        </div>
        <div class=devices-list>
            {#each Object.entries(sortedProfiles) as [deviceType, profiles]}
                <PanelButton
                    label={titleCase(deviceType)}
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
</style>