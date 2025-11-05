<script>
    import { getContext } from "svelte";
    import { Menu, MenuItem, MenuSeparator, SubMenu } from '$lib/utils/menu';
    import PrefsDialog from '$lib/dialogs/preferences/PrefsDialog.svelte';
    import { prefs } from "$lib/preferences.svelte"; 
    import { electron } from "$lib/globals.svelte";

    import {
        // file
        file_new,
        file_open,
        file_save,
        file_save_as,
        revealFolder,
        close,
        quit,
        // edit
        undo,
        redo,
        // experiment
        compilePython,
        compileJS,
        runPython,
        newWindow,
    } from '../callbacks.svelte.js';

    let current = getContext("current");

    let {
        shown=$bindable()
    } = $props()

    let show = $state({
        prefsDlg: false
    })
</script>


<Menu 
    bind:shown={shown}
>
    <SubMenu label="File" icon="/icons/rbn-file.svg">
        <MenuItem 
            icon="/icons/btn-new.svg" 
            label="New file"
            shortcut="new"
            onclick={file_new}
        />
        <MenuItem 
            icon="/icons/btn-open.svg" 
            label="Open file" 
            shortcut="open"
            onclick={file_open} 
        />
        <MenuItem 
            icon="/icons/btn-save.svg" 
            label="Save file"
            shortcut="save"
            onclick={file_save} 
            disabled={!current.experiment.history.past.length} 
        />
        <MenuItem 
            icon="/icons/btn-saveas.svg" 
            label="Save file as"
            shortcut="saveAs"
            onclick={file_save_as} 
        />
        <MenuItem
            label="Reveal in file explorer"
            onclick={revealFolder}
            shortcut="revealFolder"
            disabled={current.file?.parent === undefined}
        />
        <MenuItem
            label="Close window"
            onclick={close}
            shortcut="close"
        />

        <MenuSeparator />

        <MenuItem
            icon="/icons/btn-settings.svg"
            label="Preferences"
            onclick={(evt) => {show.prefsDlg = true}}
        />
        <PrefsDialog
            bind:shown={show.prefsDlg}
        ></PrefsDialog>
        <MenuItem
            label="Reset preferences"
            onclick={evt => prefs.reset()}
        />

        {#if electron}
            <MenuSeparator />

            <MenuItem
                label="Quit"
                onclick={quit}
                shortcut="quit"
            />
        {/if}
    </SubMenu>
</Menu>