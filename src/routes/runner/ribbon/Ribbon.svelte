<script>
    import {
        // file
        fileNew,
        fileOpen,
        fileSave,
        fileSaveAs,
        // view
        newWindow,
    } from '../callbacks.svelte.js'
    
    import Menu from "./Menu.svelte";
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import { getContext } from "svelte";
    import { electron, python } from "$lib/globals.svelte.js";
    import { IconButton, SwitchButton } from '$lib/utils/buttons';
    import { UserCtrl, ProjectCtrl } from '$lib/pavlovia/pavlovia.svelte';
    import { Experiment } from "$lib/experiment";

    let current = getContext("current");

    let {
        selection
    } = $props()

    let show = $state({
        menu: false,
        settingsDlg: false,
        findDlg: false,
        deviceMgrDlg: false,
    })
</script>

<Ribbon>
    <RibbonSection>
        <IconButton 
            icon="/icons/btn-hamburger.svg"
            label="Menu"
            onclick={() => show.menu = true} 
            borderless
        />
        <Menu 
            bind:shown={show.menu} 
        />
    </RibbonSection>
    <RibbonSection label=File icon="/icons/rbn-file.svg">
        <IconButton 
            icon="/icons/btn-new.svg" 
            label="New configuration" 
            onclick={(evt) => fileNew()} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-open.svg" 
            label="Open configuration" 
            onclick={(evt) => fileOpen(true).catch(err => console.error(err))} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-save.svg" 
            label="Save configuration" 
            onclick={fileSave}
            borderless
        />
        <IconButton 
            icon="/icons/btn-saveas.svg" 
            label="Save configuration as"
            onclick={fileSaveAs} 
            borderless
        />
    </RibbonSection>

    <RibbonSection label=Selection icon="/icons/rbn-experiment.svg">
        <SwitchButton 
            labels={["Pilot", "Run"]} 
            tooltip="Experiment will run in {current.runlist[current.selection]?.pilotMode ? "pilot" : "run"} mode"
            bind:value={
                () => current.runlist[current.selection]?.pilotMode,
                (value) => current.runlist[current.selection]?.setPilotMode(value)
            } 
            disabled={current.selection === undefined}
        />  
    </RibbonSection>

    {#if python?.ready}
        <RibbonSection label=Run icon="/icons/btn-runpy.svg">
            <IconButton 
                icon="/icons/btn-{current.runlist[selection]?.pilotMode ? "pilot" : "run"}py.svg" 
                label="{current.runlist[selection]?.pilotMode ? "Pilot" : "Run"} experiment locally" 
                onclick={evt => current.runlist[selection]?.runPython()}
                disabled={current.selection === undefined}
                bind:awaiting={current.awaiting.runpy}
                borderless
            />
            <IconButton 
                icon="/icons/btn-{current.runlist[selection]?.pilotMode ? "pilot" : "run"}js.svg" 
                label="{current.runlist[selection]?.pilotMode ? "Pilot" : "Run"} experiment in browser" 
                onclick={(evt) => current.runlist[selection]?.runJS()}
                disabled={current.selection === undefined || !(current.runlist[current.selection] instanceof Experiment)}
                bind:awaiting={current.awaiting.runjs}
                borderless
            />
        </RibbonSection>
    {/if}

    <RibbonSection label=Pavlovia icon="/icons/rbn-pavlovia.svg">
        <UserCtrl />
    </RibbonSection>

    <RibbonGap></RibbonGap>

    <RibbonSection label=Views icon="/icons/rbn-windows.svg">
        <IconButton 
            icon="/icons/btn-builder.svg" 
            label="Builder view" 
            onclick={(evt) => newWindow("builder")} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-coder.svg" 
            label="Coder view" 
            onclick={(evt) => newWindow("coder")} 
            borderless
        />
        {#if electron}
            <IconButton 
                icon="/icons/btn-runner.svg" 
                label="Runner view" 
                onclick={(evt) => newWindow("runner")} 
                borderless
            />
        {/if}
    </RibbonSection>
</Ribbon>