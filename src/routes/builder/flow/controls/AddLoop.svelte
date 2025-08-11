<script>
    import { LoopInitiator } from '$lib/experiment.svelte.js';
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { Menu, MenuItem } from '$lib/utils/menu';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from "svelte";
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    import ComponentProfiles from "$lib/components.json";
    
    let current = getContext("current");
    let notebook;

    let element = $state(
        new LoopInitiator("TrialHandler")
    )

    let showDialog = $state(false)
    let showMenu = $state(false);

    let LoopProfiles = {};
    Object.keys(ComponentProfiles).forEach((key) => {
        if (ComponentProfiles[key]['__class__'].startsWith("psychopy.experiment.loops")) {
            LoopProfiles[key] = ComponentProfiles[key]
        }
    })

</script>

<div
    class=container
>
    <!-- button to open add Loop menu -->
    <Button 
        label="Add Loop"
        icon="/icons/light/btn-loop.svg"
        tooltip="Add a loop to the experiment flow"
        onclick={() => showMenu = true}
        disabled={current.inserting}
        horizontal
    ></Button>

    <!-- menu for choosing new loop type -->
    <Menu 
        bind:shown={showMenu}
    >
        {#each Object.keys(LoopProfiles) as loopType}
            <MenuItem 
                label="New {loopType} loop..."
                onclick={() => {
                    // create blank Loop
                    current.inserting = new LoopInitiator(loopType)
                    current.inserting.exp = current.experiment;
                    // show dialog
                    showDialog = true
                }}
            />
        {/each}
    </Menu>

    <!-- dialog for creating a new Loop -->
    {#if current.inserting instanceof LoopInitiator}
    <Dialog 
        id=new-loop 
        title="New loop"
        bind:shown={showDialog} 
        onopen={() => notebook.setRestorePoint()}
        buttons={{
            OK: (evt) => {
                // add to experiment
                current.experiment.loops[current.inserting.name] = current.inserting
            }, 
            CANCEL: (evt) => {
                notebook.applyRestorePoint(evt)
                // stop inserting
                current.inserting = undefined;
            }, 
            HELP: "https://www.psychopy.org/builder/flow.html#loops",
        }}
    >
        <ParamsNotebook bind:this={notebook} element={element}></ParamsNotebook>
    </Dialog>
    {/if}
</div>

<style>
    .container {
        position: relative;
        display: grid;
        justify-content: stretch;
    }
</style>