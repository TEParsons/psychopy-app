<script>
    import { getContext } from "svelte";
    import { Menu, MenuItem, MenuSeparator, SubMenu } from '$lib/utils/menu';
    import PrefsDialog from '$lib/dialogs/preferences/PrefsDialog.svelte';
    import { prefs } from "$lib/preferences.svelte"; 
    import { electron } from "$lib/globals.svelte";
    import { showDevTools } from "$lib/utils/views.svelte"

    import {
        // file
        fileNew,
        fileOpen,
        fileSave,
        fileSaveAs,
        quit,
        // run
        togglePiloting,
        // view
        showWindow,
    } from '../callbacks.svelte.js'

    let current = getContext("current");

    let {
        shown=$bindable()
    } = $props()

    let show = $state({
        prefsDlg: false,
        findDlg: false,
        settingsDlg: false
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
        />
        <MenuItem 
            icon="/icons/btn-saveas.svg" 
            label="Save file as"
            shortcut="saveAs"
            onclick={fileSaveAs} 
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

        {#if electron}
            <MenuSeparator />

            <MenuItem
                label="Quit"
                onclick={quit}
                shortcut="quit"
            />
        {/if}
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
        <SubMenu label="Run" icon="/icons/btn-runpy.svg" disabled={current.selection === undefined}>
            <MenuItem 
                label="Toggle pilot mode"
                onclick={togglePiloting}
                shortcut="togglePilot"
                disabled={current.selection === undefined}
            />

            <MenuSeparator />

            <MenuItem 
                label="{current.runlist[current.selection]?.pilotMode ? "Pilot" : "Run"} in Python" 
                icon="/icons/btn-{current.runlist[current.selection]?.pilotMode ? "pilot" : "run"}py.svg" 
                onclick={evt => current.awaiting.runpy = current.runlist[current.selection]?.runPython()}
                shortcut="runPython"
                disabled={current.selection === undefined}
            />
            <MenuItem 
                label="{current.runlist[current.selection]?.pilotMode ? "Pilot" : "Run"} in browser" 
                icon="/icons/btn-{current.runlist[current.selection]?.pilotMode ? "pilot" : "run"}js.svg" 
                onclick={(evt) => current.awaiting.runjs = current.runlist[current.selection]?.runJS()}
                shortcut="runJS"
                disabled={current.selection === undefined}
            />
        </SubMenu>
    {/if}

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
</Menu>


<!-- dialogs need to be outside so they're not hidden when the menu is -->
<PrefsDialog
    bind:shown={show.prefsDlg}
/>
