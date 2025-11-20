<script>
    import {
        // file
        fileNew,
        fileOpen,
    } from '../callbacks.svelte.js'
    
    import Menu from "./Menu.svelte";
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import { getContext } from "svelte";
    import { electron, python } from "$lib/globals.svelte.js";
    import { IconButton, SwitchButton } from '$lib/utils/buttons';
    import { UserCtrl, ProjectCtrl } from '$lib/pavlovia/pavlovia.svelte';

    let current = getContext("current");

    let show = $state({
        menu: false,
        settingsDlg: false,
        findDlg: false,
        deviceMgrDlg: false,
    })

    let awaiting = $state({
        runpy: Promise.resolve(""),
        compilepy: Promise.resolve(""),
        runjs: Promise.resolve(""),
        compilejs: Promise.resolve("")
    })

    let prompts = $state({
        NEW: false,
        OPEN: false,
        PYCOMPILE: false,
        PYRUN: false
    });
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
            onclick={(evt) => fileNew(current)} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-open.svg" 
            label="Open configuration" 
            onclick={(evt) => fileOpen(current, true).catch(err => console.error(err))} 
            borderless
        />
        <!-- <IconButton 
            icon="/icons/btn-save.svg" 
            label="Save file" 
            onclick={file_save}
            disabled={!current.experiment.history.past.length} 
            borderless
        />
        <IconButton 
            icon="/icons/btn-saveas.svg" 
            label="Save file as"
            onclick={file_save_as} 
            borderless
        /> -->
    </RibbonSection>

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