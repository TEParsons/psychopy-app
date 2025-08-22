<script>
    import {
        // file
        file_new,
        file_open,
        file_save,
        file_save_as,
        // edit
        undo,
        redo,
        // experiment
        // views
        new_builder_frame,
        new_coder_frame,
        new_runner_frame,
    } from './callbacks.js'
    
    import { Menu, MenuItem, MenuSeparator, SubMenu } from '$lib/utils/menu'
    import { Ribbon, RibbonSection, RibbonGap } from '$lib/utils/ribbon';
    import { getContext } from "svelte";
    import SavePrompt from "./SavePrompt.svelte"
    import { FindDialog } from "../../../lib/dialogs/find/index.js";
    import { DeviceManagerDialog } from "../../../lib/dialogs/deviceManager/index.js"
    import ParamsDialog from "$lib/paramCtrls/ParamsDialog.svelte";
    import PrefsDialog from '../../../lib/dialogs/preferences/PrefsDialog.svelte';
    import { IconButton, DropdownButton, SwitchButton } from '$lib/utils/buttons';
    import { PavloviaUsers } from '$lib/pavlovia/pavlovia.svelte';

    let current = getContext("current");

    let showMenu = $state.raw(false);

    let showSettingsDlg = $state.raw(false);
    let settingsNotebook;

    let showFindDialog = $state.raw(false);

    let showDeviceMgr = $state.raw(false);
    let showPrefsDialog = $state.raw(false);

    let lastAction = $derived.by(() => {
        if (current.experiment.history.past.length) {
            return ` "${current.experiment.history.past.at(-1).msg}"`
        }
    })
    let nextAction = $derived.by(() => {
        if (current.experiment.history.future.length) {
            return ` "${current.experiment.history.future[0].msg}"`
        }
    })

    let savePrompt = $state({
        NEW: false,
        OPEN: false
    });
</script>

<Ribbon>
    <RibbonSection>
        <IconButton 
            icon="icons/btn-hamburger.svg"
            label="Menu"
            onclick={() => showMenu = true} 
            borderless
        />
        <Menu 
            bind:shown={showMenu}
        >
            <SubMenu label="File" icon="icons/rbn-file.svg">
                <MenuItem 
                    icon="icons/btn-new.svg" 
                    label="New file" 
                    onclick={file_new}
                />
                <MenuItem 
                    icon="icons/btn-open.svg" 
                    label="Open file" 
                    onclick={file_open} 
                />
                <MenuItem 
                    icon="icons/btn-save.svg" 
                    label="Save file" 
                    onclick={file_save} 
                    disabled={!current.experiment.history.past.length} 
                />
                <MenuItem 
                    icon="icons/btn-saveas.svg" 
                    label="Save file as"
                    onclick={file_save_as} 
                />
                <MenuItem
                    icon="icons/btn-settings.svg"
                    label="Preferences"
                    onclick={(evt) => {showPrefsDialog = true}}
                ></MenuItem>
            </SubMenu>
        </Menu>
        <PrefsDialog
            bind:shown={showPrefsDialog}
        ></PrefsDialog>
    </RibbonSection>
    <RibbonSection label=File icon="icons/rbn-file.svg">
        <IconButton 
            icon="icons/btn-new.svg" 
            label="New file" 
            onclick={(evt) => savePrompt.NEW = true}
            borderless
        />
        <SavePrompt
            bind:shown={savePrompt.NEW}
            action={file_new}
        />  
        <IconButton 
            icon="icons/btn-open.svg" 
            label="Open file" 
            onclick={(evt) => savePrompt.OPEN = true} 
            borderless
        />
        <SavePrompt
            bind:shown={savePrompt.OPEN}
            action={file_open}
        />
        <IconButton 
            icon="icons/btn-save.svg" 
            label="Save file" 
            onclick={file_save}
            disabled={!current.experiment.history.past.length} 
            borderless
        />
        <IconButton 
            icon="icons/btn-saveas.svg" 
            label="Save file as"
            onclick={file_save_as} 
            borderless
        />
    </RibbonSection>

    <RibbonSection label=Edit icon="icons/rbn-edit.svg">
        <IconButton 
            icon="icons/btn-undo.svg" 
            label="Undo{lastAction}" 
            onclick={undo} 
            disabled={current.file === null || !current.experiment.history.past.length} 
            borderless
        />
        <IconButton 
            icon="icons/btn-redo.svg" 
            label="Redo {nextAction}" 
            onclick={redo} 
            disabled={current.file === null || !current.experiment.history.future.length} 
            borderless
        />
        <IconButton 
            icon="icons/btn-find.svg" 
            label="Find" 
            onclick={() => showFindDialog = true}
            borderless
        />
        <FindDialog
            bind:shown={showFindDialog}
        ></FindDialog>
    </RibbonSection>
    
    <RibbonSection label=Experiment icon="icons/rbn-experiment.svg">
        <!-- <IconButton 
            id="ribbon-btn-monitors" 
            icon="icons/btn-monitors.svg" 
            label="Monitor centre" 
        />         -->
        <IconButton
            icon="icons/btn-devices.svg"
            label="Open the device manager"
            onclick={(evt) => showDeviceMgr = true}
            borderless
        ></IconButton>
        <DeviceManagerDialog
            bind:shown={showDeviceMgr}
        ></DeviceManagerDialog>

        <IconButton 
            icon="icons/btn-settings.svg" 
            label="Experiment settings" 
            onclick={(evt) => showSettingsDlg = true}
            disabled={current.experiment === null}
            borderless
        />
        {#if current.experiment !== null }
        <ParamsDialog
            element={current.experiment.settings}
            bind:shown={showSettingsDlg}
        ></ParamsDialog>
        {/if}
        <SwitchButton 
            labels={["Pilot", "Run"]} 
            tooltip="Experiment will run in {current.experiment.pilotMode ? "pilot" : "run"} mode"
            bind:value={
                () => current.experiment.pilotMode,
                (value) => {
                    // update history
                    current.experiment.history.update(`toggle pilot mode`)
                    // set pilot mode
                    current.experiment.settings.params['runMode'].val = value;
                }
            } 
            disabled={current.experiment === null}
        />        
    </RibbonSection>

    <!-- <RibbonSection id=desktop label=Desktop icon="icons/rbn-desktop.svg">
        <IconButton id="ribbon-btn-compilepy" icon="icons/btn-compilepy.svg" label="Compile to Python" />
        <IconButton id="ribbon-btn-{$experiment.pilotMode ? "pilotpy" : "runpy"}" icon="icons/btn-{$experiment.pilotMode ? "pilotpy" : "runpy"}.svg" label="{$experiment.pilotMode ? "Pilot" : "Run"} in Python" />
    </RibbonSection> -->

    <!-- <RibbonSection id=browser label=Browser icon="icons/rbn-browser.svg">
        <IconButton 
            id="ribbon-btn-compilejs" 
            icon="icons/btn-compilejs.svg" 
            label="Compile to JavaScript" 
        />
        <IconButton 
            id="ribbon-btn-{$experiment.pilotMode ? "pilotjs" : "runjs"}" 
            icon="icons/btn-{$experiment.pilotMode ? "pilotjs" : "runjs"}.svg" 
            label="{$experiment.pilotMode ? "Pilot" : "Run"} in browser" 
        />
        <IconButton 
            id="ribbon-btn-sync" 
            icon="icons/btn-sync.svg" 
            label="Sync to Pavlovia" 
        />
    </RibbonSection> -->

    <RibbonSection label=Pavlovia icon="icons/rbn-pavlovia.svg">
        <DropdownButton
            label={current.user ? current.user.name : "No user"}
            icon={current.user ? current.user.avatar_url : undefined}
            onclick={(evt) => {
                if (current.user) {
                    window.open(current.user.web_url)
                }
            }}
        >
            <MenuItem
                label="Edit user..."
                icon="icons/btn-edit.svg"
            ></MenuItem>
            <SubMenu
                label="Switch user..."
            >
                {#each Object.values(PavloviaUsers) as user}
                    <MenuItem
                        label={user.name}
                        icon={user.avatar_url}
                        onclick={(evt) => current.user = user}
                    ></MenuItem>
                {/each}
                <MenuSeparator/>
                <MenuItem
                    label="New user..."
                    icon="icons/btn-new.svg"
                ></MenuItem>
            </SubMenu>
            <MenuSeparator/>
            {#if current.user}
                <MenuItem
                    label="Logout"
                    onclick={(evt) => current.user = undefined}
                ></MenuItem>
            {:else}
                <MenuItem
                    label="Login"
                ></MenuItem>
            {/if}
        </DropdownButton>
        <DropdownButton
            label={current.project ? current.project.name : "No project"}
            icon={current.project ? current.project.avatar_url : undefined}
            onclick={(evt) => {
                if (current.project) {
                    window.open(current.project.web_url)
                }
            }}
        >
            <MenuItem
                label="New project"
                icon="icons/btn-add.svg"
            ></MenuItem>
            <MenuItem
                label="Edit project"
                icon="icons/btn-edit.svg"
            ></MenuItem>
            <MenuSeparator/>
            <MenuItem
                label="Search projects..."
                icon="icons/btn-find.svg"
            ></MenuItem>
        </DropdownButton>
    </RibbonSection>

    <RibbonGap></RibbonGap>

    <RibbonSection label=Views icon="icons/rbn-windows.svg">
        <IconButton 
            icon="icons/btn-builder.svg" 
            label="Builder view" 
            onclick={new_builder_frame} 
            borderless
        />
        <IconButton 
            icon="icons/btn-coder.svg" 
            label="Coder view" 
            onclick={new_coder_frame} 
            borderless
        />
        <IconButton 
            icon="icons/btn-runner.svg" 
            label="Runner view" 
            onclick={new_runner_frame} 
            borderless
        />
    </RibbonSection>
</Ribbon>