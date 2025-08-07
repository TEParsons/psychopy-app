<script>
    import ParamCtrl from "./ParamCtrl.svelte";
    import StartStopCtrl from "./StartStopCtrl.svelte";
    import { Notebook, NotebookPage } from "$lib/utils/notebook"
    import { getContext } from "svelte";

    let {
        element,
    } = $props();

    let backup = {}

    let current = getContext("current")

    export function applyRestorePoint(evt) {
        // restore backup to clear changes
        element.fromJSON(backup)
        // remove last entry from experiment history
        current.experiment.history.past.pop()
    }

    export function setRestorePoint(evt) {
        // update history
        current.experiment.history.update()
        // set restore point
        backup = element.toJSON()
    }

    let pageIndex = $state()

</script>

<div class=params-container>
    <Notebook>
        {#each Object.entries(element.sortedParams) as [categ, params]}
            <NotebookPage
                label={categ}
                data={element}
                bind:selected={
                    () => {return pageIndex === categ},
                    (value) => {pageIndex = categ}
                }
            >
                <div class=params-panel>
                    <!-- start ctrl, if needed -->
                    {#if "startVal" in params}
                        <StartStopCtrl
                            name=Start
                            params={element.startParams}
                        ></StartStopCtrl>
                    {/if}
                    <!-- stop ctrl, if needed -->
                    {#if "stopVal" in params}
                        <StartStopCtrl
                            name=Stop
                            params={element.stopParams}
                        ></StartStopCtrl>
                    {/if}
                    <!-- other params -->
                    {#each [...Object.entries(params)] as [name, param]}
                        {#if !["startVal", "startType", "startEstim", "stopVal", "stopType", "durationEstim"].includes(name)}
                            <ParamCtrl 
                                name={name} 
                                param={param}
                            ></ParamCtrl>
                        {/if}
                    {/each}
                </div>
            </NotebookPage>
        {/each}
    </Notebook>
</div>

<style>
    .params-panel {
        display: grid;
        grid-auto-flow: row;
        align-content: start;
        gap: 1rem;
        width: 45rem;
        box-sizing: border-box;
        padding: 1rem;
    }
    .params-container {
        padding: 1rem;
        height: 100%;
        box-sizing: border-box;
    }
</style>
