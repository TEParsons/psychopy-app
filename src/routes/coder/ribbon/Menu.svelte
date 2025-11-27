<script>
    import { getContext } from "svelte";
    import { Menu, MenuItem, MenuSeparator, SubMenu } from '$lib/utils/menu';
    import PrefsDialog from '$lib/dialogs/preferences/PrefsDialog.svelte';
    import ParamsDialog from "$lib/paramCtrls/ParamsDialog.svelte";
    import { FindDialog } from "$lib/dialogs/find";
    import { prefs } from "$lib/preferences.svelte"; 
    import { electron, python } from "$lib/globals.svelte";
    import { DeviceManagerDialog } from "$lib/dialogs/deviceManager/index.js";
    import { PluginManagerDlg } from "$lib/dialogs/pluginManager";

    import {
        // file
        fileNew,
        fileOpen,
        fileSave,
        fileSaveAs,
        // revealFolder,
        // close,
        // quit,
        // // edit
        // undo,
        // redo,
        // // view
        // newWindow,
        // showWindow,
        // showDevTools,
        // // experiment
        // copyRoutine,
        // pasteRoutine,
        // // run
        // togglePiloting,
        // sendToRunner,
        // compilePython,
        // compileJS,
        // runPython
    } from '../callbacks.js';

    let current = getContext("current");

    let {
        shown=$bindable()
    } = $props()

    let show = $state({
        prefsDlg: false,
        findDlg: false,
        settingsDlg: false,
        deviceMgrDlg: false,
        pluginMgr: false,
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
            onclick={fileNew}
        />
        <MenuItem 
            icon="/icons/btn-open.svg" 
            label="Open file" 
            shortcut="open"
            onclick={fileOpen} 
        />
        <MenuItem 
            icon="/icons/btn-save.svg" 
            label="Save file"
            shortcut="save"
            onclick={fileSave} 
            disabled={!current.pages[current.tab]?.canUndo} 
        />
        <MenuItem 
            icon="/icons/btn-saveas.svg" 
            label="Save file as"
            shortcut="saveAs"
            onclick={fileSaveAs} 
        />
        <MenuItem
            label="Reveal in file explorer"
            onclick={revealFolder}
            shortcut="revealFolder"
            disabled={current.experiment.file?.parent === undefined}
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
        <MenuItem
            label="Reset preferences"
            onclick={evt => prefs.reset()}
        />
    </SubMenu>
</Menu>