<script>
    import { ParamCtrl } from "$lib/paramCtrls"

    let {
        calib=$bindable()
    } = $props()
</script>


<div class=monitor-config>
    {#each Object.keys(calib.params) as key}
        <ParamCtrl 
            name={key}
            bind:param={calib.params[key]}
        />
    {/each}
</div>

<style>
    .monitor-config {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        justify-content: stretch;
        align-items: stretch;
        padding: 1rem;
        min-width: 35rem;
    }
</style>