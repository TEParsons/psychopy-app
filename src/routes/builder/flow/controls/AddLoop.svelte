<script>
    import { LoopInitiator } from '$lib/experiment.svelte.js';
    import { ParamsNotebook } from '$lib/utils/paramCtrls/index.js';
    import { Menu, MenuItem } from '$lib/utils/menu';
    import { Button } from '$lib/utils/buttons';
    import { getContext } from "svelte";
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    import ComponentProfiles from "$lib/components.json";
    import LoopProfiles from "$lib/loops.json";
    
    let current = getContext("current");
    let notebook;

    let element = $state(
        new LoopInitiator("TrialHandler")
    )

    let showDialog = $state(false)
    let showMenu = $state(false);

    function titleCase(label) {
        return label.replace(
            "Handler", ""
        ).replace(
            /([a-z])([A-Z])/g, "$1 $2"
        ).toLowerCase();
    }

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

<div
    class=container
>
    <!-- button to open add Loop menu -->
    <Button 
        label="Add Loop"
        icon="/icons/btn-loop.svg"
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
                label="New {titleCase(loopType)} loop..."
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
        buttonsDisabled={btnsDisabled}
    >
        <ParamsNotebook 
            bind:this={notebook} 
            bind:valid={valid}
            element={element}
        ></ParamsNotebook>
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