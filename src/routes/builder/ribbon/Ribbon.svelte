<script>
    import { Menu, MenuItem, SubMenu } from '$lib/utils/menu'
    import { Ribbon, RibbonSection, RibbonGap, RibbonButton, RibbonSwitchButton } from '$lib/utils/ribbon';
    import { getContext } from "svelte";
    import { Dialog } from "$lib/utils/dialog";
    import SavePrompt from "./SavePrompt.svelte"

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
    
    import { Experiment } from "$lib/experiment.svelte";
    import { FindDialog } from "../../dialogs/find";
    import { DeviceManagerDialog } from "../../dialogs/deviceManager"
    import ParamsDialog from "$lib/utils/paramCtrls/ParamsDialog.svelte";

    let current = getContext("current");

    let showMenu = $state(false);

    let showSettingsDlg = $state(false);
    let settingsNotebook;

    let showFindDialog = $state(false);

    let showDeviceMgr = $state(false)

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
        <RibbonButton 
            icon="/icons/btn-hamburger.svg"
            label="Menu"
            onclick={() => showMenu = true} 
        />
        <Menu 
            bind:shown={showMenu}
        >
            <SubMenu label="File" icon="/icons/rbn-file.svg">
                <MenuItem 
                    icon="/icons/btn-new.svg" 
                    label="New file" 
                    onclick={file_new}
                />
                <MenuItem 
                    icon="/icons/btn-open.svg" 
                    label="Open file" 
                    onclick={file_open} 
                />
                <MenuItem 
                    icon="/icons/btn-save.svg" 
                    label="Save file" 
                    onclick={file_save} 
                    disabled={!current.experiment.history.past.length} 
                />
                <MenuItem 
                    icon="/icons/btn-saveas.svg" 
                    label="Save file as"
                    onclick={file_save_as} 
                />
            </SubMenu>
        </Menu>
    </RibbonSection>
    <RibbonSection label=File icon="/icons/rbn-file.svg">
        <RibbonButton 
            icon="/icons/btn-new.svg" 
            label="New file" 
            onclick={(evt) => savePrompt.NEW = true}
        />
        <SavePrompt
            bind:shown={savePrompt.NEW}
            action={file_new}
        />  
        <RibbonButton 
            icon="/icons/btn-open.svg" 
            label="Open file" 
            onclick={(evt) => savePrompt.OPEN = true} 
        />
        <SavePrompt
            bind:shown={savePrompt.OPEN}
            action={file_open}
        />
        <RibbonButton 
            icon="/icons/btn-save.svg" 
            label="Save file" 
            onclick={file_save}
            disabled={!current.experiment.history.past.length} 
        />
        <RibbonButton 
            icon="/icons/btn-saveas.svg" 
            label="Save file as"
            onclick={file_save_as} 
        />
    </RibbonSection>

    <RibbonSection label=Edit icon="/icons/rbn-edit.svg">
        <RibbonButton 
            icon="/icons/btn-undo.svg" 
            label="Undo{lastAction}" 
            onclick={undo} 
            disabled={current.file === null || !current.experiment.history.past.length} 
        />
        <RibbonButton 
            icon="/icons/btn-redo.svg" 
            label="Redo {nextAction}" 
            onclick={redo} 
            disabled={current.file === null || !current.experiment.history.future.length} 
        />
        <RibbonButton 
            icon="/icons/btn-find.svg" 
            label="Find" 
            onclick={() => showFindDialog = true}
        />
        <FindDialog
            bind:shown={showFindDialog}
        ></FindDialog>
    </RibbonSection>
    
    <RibbonSection label=Experiment icon="/icons/rbn-experiment.svg">
        <!-- <RibbonButton 
            id="ribbon-btn-monitors" 
            icon="/icons/btn-monitors.svg" 
            label="Monitor centre" 
        />         -->
        <RibbonButton
            icon="/icons/btn-devices.svg"
            label="Open the device manager"
            onclick={(evt) => showDeviceMgr = true}
        ></RibbonButton>
        <DeviceManagerDialog
            bind:shown={showDeviceMgr}
        ></DeviceManagerDialog>

        <RibbonButton 
            icon="/icons/btn-settings.svg" 
            label="Experiment settings" 
            onclick={(evt) => showSettingsDlg = true}
            disabled={current.experiment === null}
        />
        {#if current.experiment !== null }
        <ParamsDialog
            element={current.experiment.settings}
            bind:shown={showSettingsDlg}
        ></ParamsDialog>
        {/if}
        <RibbonSwitchButton 
            labels={["Pilot", "Run"]} 
            bind:state={
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

    <!-- <RibbonSection id=desktop label=Desktop icon="/icons/rbn-desktop.svg">
        <RibbonButton id="ribbon-btn-compilepy" icon="/icons/btn-compilepy.svg" label="Compile to Python" />
        <RibbonButton id="ribbon-btn-{$experiment.pilotMode ? "pilotpy" : "runpy"}" icon="/icons/btn-{$experiment.pilotMode ? "pilotpy" : "runpy"}.svg" label="{$experiment.pilotMode ? "Pilot" : "Run"} in Python" />
    </RibbonSection> -->

    <!-- <RibbonSection id=browser label=Browser icon="/icons/rbn-browser.svg">
        <RibbonButton 
            id="ribbon-btn-compilejs" 
            icon="/icons/btn-compilejs.svg" 
            label="Compile to JavaScript" 
        />
        <RibbonButton 
            id="ribbon-btn-{$experiment.pilotMode ? "pilotjs" : "runjs"}" 
            icon="/icons/btn-{$experiment.pilotMode ? "pilotjs" : "runjs"}.svg" 
            label="{$experiment.pilotMode ? "Pilot" : "Run"} in browser" 
        />
        <RibbonButton 
            id="ribbon-btn-sync" 
            icon="/icons/btn-sync.svg" 
            label="Sync to Pavlovia" 
        />
    </RibbonSection> -->

    <RibbonSection label=Pavlovia icon="/icons/rbn-pavlovia.svg">
        ToddOST
        No project
    </RibbonSection>

    <RibbonGap></RibbonGap>

    <RibbonSection label=Views icon="/icons/rbn-windows.svg">
        <RibbonButton 
            icon="/icons/btn-builder.svg" 
            label="Builder view" 
            onclick={new_builder_frame} 
        />
        <RibbonButton 
            icon="/icons/btn-coder.svg" 
            label="Coder view" 
            onclick={new_coder_frame} 
        />
        <RibbonButton 
            icon="/icons/btn-runner.svg" 
            label="Runner view" 
            onclick={new_runner_frame} 
        />
    </RibbonSection>
</Ribbon>