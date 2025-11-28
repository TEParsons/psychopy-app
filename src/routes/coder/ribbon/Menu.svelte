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
        revealFolder,
        quit,
        // edit
        undo,
        redo,
        find,
        // view
        // newWindow,
        showWindow,
        showDevTools,
        // // experiment
        // copyRoutine,
        // pasteRoutine,
        // // run
        togglePiloting,
        sendToRunner,
        runPython,
        runJS
    } from '../callbacks.svelte.js';

    let current = getContext("current");

    let {
        shown=$bindable()
    } = $props()

    let show = $state({
        prefsDlg: false,
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
            disabled={current.pages[current.tab]?.file?.parent === undefined}
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

    <SubMenu label="Edit" icon="/icons/rbn-edit.svg">
        <MenuItem 
            label="Undo"
            icon="/icons/btn-undo.svg"
            disabled={!current.pages[current.tab]?.canUndo}
            onclick={undo}
            shortcut="undo"
        />
        <MenuItem 
            label="Redo"
            icon="/icons/btn-redo.svg"
            onclick={redo}
            disabled={!current.pages[current.tab]?.redo}
            shortcut="redo"
        />
        <MenuSeparator />
        <MenuItem 
            label="Find"
            icon="/icons/btn-find.svg"
            onclick={find}
            disabled={!current.pages[current.tab]?.editor}
            shortcut="find"
        />
    </SubMenu>

    <SubMenu label="View" icon="/icons/rbn-windows.svg">
        <MenuItem 
            label="Show Builder"
            onclick={evt => showWindow("builder")}
        />
        <MenuItem 
            label="Show Coder"
            onclick={evt => showWindow("coder")}
        />
        <MenuItem 
            label="Show Runner"
            onclick={evt => showWindow("runner")}
        />

        <MenuSeparator />

        <MenuItem 
            label="Show developer tools"
            onclick={showDevTools}
            shortcut="showDevTools"
        />
    </SubMenu>

    {#if electron}
        <SubMenu label="Run" icon="/icons/btn-runpy.svg">
            <MenuItem 
                label="Toggle pilot mode"
                onclick={togglePiloting}
                shortcut="togglePilot"
                disabled={!current.pages[current.tab]}
            />
            <MenuItem 
                label="Send to Runner"
                icon="/icons/btn-send{current.pages[current.tab]?.pilotMode ? "pilot" : "run"}.svg" 
                onclick={sendToRunner}
                shortcut="sendToRunner"
                disabled={!current.pages[current.tab]}
            />

            <MenuSeparator />

            <MenuItem 
                label="{current.pages[current.tab]?.pilotMode ? "Pilot" : "Run"} in Python" 
                icon="/icons/btn-{current.pages[current.tab]?.pilotMode?.pilotMode ? "pilot" : "run"}py.svg" 
                onclick={evt => runPython()}
                shortcut="runPython"
                disabled={!current.pages[current.tab] || current.pages[current.tab].file.ext !== ".py"}
            />

        </SubMenu>
    {/if}

    <SubMenu label="Tools" icon="/icons/btn-hamburger.svg">
        <MenuItem 
            label="Manage plugins and packages"
            icon="/icons/btn-plugin.svg"
            onclick={evt => show.pluginMgr = true}
            disabled={!python?.ready}
        />
    </SubMenu>

    <SubMenu label="Help">
        <MenuItem 
            label="PsychoPy Homepage"
            onclick={evt => open("https://www.psychopy.org/")}
        />
        <MenuItem 
            label="Documentation"
            onclick={evt => open("https://www.psychopy.org/documentation")}
        />
        <MenuItem 
            label="Help Forum"
            onclick={evt => open("https://discourse.psychopy.org/")}
        />
        <MenuSeparator />
        {#if electron}
            {#await electron.version() then version}
                <MenuItem
                    label="PsychoPy {version.major}.{version.minor}"
                    disabled
                />
            {/await}
        {/if}
    </SubMenu>

    <MenuSeparator />

    {#if electron}
        <MenuItem
            label="Quit"
            onclick={quit}
            shortcut="quit"
        />
    {/if}  
</Menu>


<!-- dialogs need to be outside so they're not hidden when the menu is -->
<PrefsDialog
    bind:shown={show.prefsDlg}
/>
<PluginManagerDlg 
    bind:shown={show.pluginMgr}
/>
