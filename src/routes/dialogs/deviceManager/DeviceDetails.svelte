<script>
    import { ParamsNotebook, ParamCtrl } from "$lib/utils/paramCtrls";
    import { Device } from "$lib/experiment.svelte";
    import { getContext } from "svelte";
    import { NotebookPage } from "$lib/utils/notebook";

    let {
        device
    } = $props()

    device.tag = device.__name__
    let deviceObject = new Device(device.tag, device.profile);
    deviceObject.fromJSON(device)
    // pop name so it's not shown within the notebook
    let name = deviceObject.params['name']
    delete deviceObject.params['name']

    let devices = getContext("devices")
</script>

<NotebookPage
    bind:selected={
        () => {return devices.current === deviceObject},
        (value) => {devices.current = deviceObject}
    }
    label={name.val} 
    data={deviceObject}
>
    <div class=device-details-pnl>
        <div class=name-container>
            <ParamCtrl
                name="name"
                param={name}
            ></ParamCtrl>
        </div>
        <table class=device-params>
            <tbody>
                {#each Object.entries(deviceObject.profile) as [key, val]}
                    <tr>
                        <th>{key}</th>
                        <td>{val}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <ParamsNotebook
            element={deviceObject}
        >
        </ParamsNotebook>
    </div>
</NotebookPage>

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

    table.device-params {
        border-collapse: collapse;
        margin: 1rem;
    }
    table.device-params td, 
    table.device-params th {
        border: 1px solid var(--overlay);
        padding: .5rem;
    }
    table.device-params th {
        text-align: right;
        background-color: var(--mantle);
    }
</style>