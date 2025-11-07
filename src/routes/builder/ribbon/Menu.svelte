<script>
    import { getContext } from "svelte";
    import { Menu, MenuItem, MenuSeparator, SubMenu } from '$lib/utils/menu';
    import PrefsDialog from '$lib/dialogs/preferences/PrefsDialog.svelte';
    import ParamsDialog from "$lib/paramCtrls/ParamsDialog.svelte";
    import { FindDialog } from "$lib/dialogs/find";
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
        copyRoutine,
        pasteRoutine,
        // run
        togglePiloting,
        sendToRunner,
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

    <SubMenu label="Edit" icon="/icons/rbn-edit.svg">
        <MenuItem 
            label="Undo"
            icon="/icons/btn-undo.svg"
            disabled={current.file === null || !current.experiment.history.past.length}
            onclick={undo}
            shortcut="undo"
        />
        <MenuItem 
            label="Redo"
            icon="/icons/btn-redo.svg"
            onclick={redo}
            disabled={current.file === null || !current.experiment.history.future.length}
            shortcut="redo"
        />
        <MenuSeparator />
        <MenuItem 
            label="Find in experiment"
            icon="/icons/btn-find.svg"
            onclick={evt => show.findDlg = true}
            shortcut="find"
        />
    </SubMenu>

    <SubMenu label="Experiment" icon="/icons/rbn-experiment.svg">
        <MenuItem 
            label="Experiment settings"
            icon="/icons/btn-settings.svg"
            onclick={evt => show.settingsDlg = true}
        />

        <MenuSeparator />

        <MenuItem 
            label="Copy current Routine"
            icon="/icons/btn-copy.svg"
            onclick={evt => copyRoutine()}
        />

        <MenuItem 
            label="Paste Routine"
            icon="/icons/btn-paste.svg"
            onclick={evt => pasteRoutine()}
        />

        <!-- todo: Copy/paste Routine/Component/etc. -->
    </SubMenu>

    {#if electron}
        <SubMenu label="Run" icon="/icons/btn-runpy.svg">
            <MenuItem 
                label="Toggle pilot mode"
                onclick={togglePiloting}
                shortcut="togglePilot"
            />
            <MenuItem 
                label="Send to Runner"
                icon="/icons/btn-send{current.experiment.pilotMode ? "pilot" : "run"}.svg" 
                onclick={sendToRunner}
                shortcut="sendToRunner"
                disabled={!current.experiment.filename}
            />

            <MenuSeparator />

            <MenuItem 
                label="Compile Python"
                icon="/icons/btn-compilepy.svg" 
                onclick={evt => compilePython()}
                shortcut="compilePython"
                disabled={current.experiment === null}
            /> 
            <MenuItem 
                label="{current.experiment.pilotMode ? "Pilot" : "Run"} in Python" 
                icon="/icons/btn-{current.experiment.pilotMode ? "pilot" : "run"}py.svg" 
                onclick={evt => runPython()}
                shortcut="runPython"
                disabled={current.experiment === null}
            />

            <MenuSeparator />

            <MenuItem 
                label="Compile JS" 
                icon="/icons/btn-compilejs.svg" 
                onclick={(evt) => compileJS()}
                shortcut="compileJS"
                disabled={current.experiment === null}
            />
            <MenuItem 
                label="{current.experiment.pilotMode ? "Pilot" : "Run"} in browser" 
                icon="/icons/btn-{current.experiment.pilotMode ? "pilot" : "run"}js.svg" 
                onclick={(evt) => console.log("RUN JS")}
                shortcut="runJS"
                disabled={current.experiment === null}
            />
        </SubMenu>
    {/if}
</Menu>


<!-- dialogs need to be outside so they're not hidden when the menu is -->
<PrefsDialog
    bind:shown={show.prefsDlg}
/>
<FindDialog
    bind:shown={show.findDlg}
/>
<ParamsDialog
    element={current.experiment.settings}
    bind:shown={show.settingsDlg}
/>