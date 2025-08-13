<script>
    import { ParamsNotebook, ParamCtrl } from "$lib/utils/paramCtrls";

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
    <table class=device-params>
        <tbody>
            {#each Object.entries(device.profile) as [key, val]}
                <tr>
                    <th>{key}</th>
                    <td>{val}</td>
                </tr>
            {/each}
        </tbody>
    </table>
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