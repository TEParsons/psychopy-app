<script>
    import { theme } from "$lib/globals.svelte.js"
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
    
    import { ParamsNotebook } from "$lib/utils/paramCtrls/index.js";

    let current = getContext("current");

    let showMenu = $state(false);

    let showSettingsDlg = $state(false);
    let settingsNotebook;

    let savePrompt = $state({
        NEW: false,
        OPEN: false
    });
</script>

<Ribbon>
    <RibbonSection>
        <RibbonButton 
            icon="/icons/{theme}/btn-hamburger.svg"
            label="Menu"
            onclick={() => showMenu = true} 
        />
        <Menu 
            bind:shown={showMenu}
        >
            <SubMenu label="File" icon="/icons/{theme}/rbn-file.svg">
                <MenuItem 
                    icon="/icons/{theme}/btn-new.svg" 
                    label="New file" 
                    onclick={file_new}
                />
                <MenuItem 
                    icon="/icons/{theme}/btn-open.svg" 
                    label="Open file" 
                    onclick={file_open} 
                />
                <MenuItem 
                    icon="/icons/{theme}/btn-save.svg" 
                    label="Save file" 
                    onclick={file_save} 
                    disabled={!current.experiment.history.past.length} 
                />
                <MenuItem 
                    icon="/icons/{theme}/btn-saveas.svg" 
                    label="Save file as"
                    onclick={file_save_as} 
                />
            </SubMenu>
        </Menu>
    </RibbonSection>
    <RibbonSection label=File icon="/icons/{theme}/rbn-file.svg">
        <RibbonButton 
            icon="/icons/{theme}/btn-new.svg" 
            label="New file" 
            onclick={(evt) => savePrompt.NEW = true}
        />
        <SavePrompt
            bind:shown={savePrompt.NEW}
            action={file_new}
        />  
        <RibbonButton 
            icon="/icons/{theme}/btn-open.svg" 
            label="Open file" 
            onclick={(evt) => savePrompt.OPEN = true} 
        />
        <SavePrompt
            bind:shown={savePrompt.OPEN}
            action={file_open}
        />
        <RibbonButton 
            icon="/icons/{theme}/btn-save.svg" 
            label="Save file" 
            onclick={file_save}
            disabled={!current.experiment.history.past.length} 
        />
        <RibbonButton 
            icon="/icons/{theme}/btn-saveas.svg" 
            label="Save file as"
            onclick={file_save_as} 
        />
    </RibbonSection>

    <RibbonSection label=Edit icon="/icons/{theme}/rbn-edit.svg">
        <RibbonButton 
            icon="/icons/{theme}/btn-undo.svg" 
            label="Undo" 
            onclick={undo} 
            disabled={current.file === null || !current.experiment.history.past.length} 
        />
        <RibbonButton 
            icon="/icons/{theme}/btn-redo.svg" 
            label="Redo" 
            onclick={redo} 
            disabled={current.file === null || !current.experiment.history.future.length} 
        />
        <RibbonButton 
            icon="/icons/{theme}/btn-find.svg" 
            label="Find" 
        />
    </RibbonSection>
    
    <RibbonSection label=Experiment icon="/icons/{theme}/rbn-experiment.svg">
        <!-- <RibbonButton 
            id="ribbon-btn-monitors" 
            icon="/icons/{theme}/btn-monitors.svg" 
            label="Monitor centre" 
        />         -->
        <RibbonButton 
            icon="/icons/{theme}/btn-settings.svg" 
            label="Experiment settings" 
            onclick={() => {showSettingsDlg = true}}
            disabled={current.experiment === null}
        />
        {#if current.experiment !== null }
        <Dialog 
            id=experiment-settings
            title="Experiment settings"
            bind:shown={showSettingsDlg} 
            buttons={{
                OK: () => settingsNotebook.applyChanges(), 
                APPLY: () => settingsNotebook.applyChanges(), 
                CANCEL: () => settingsNotebook.discardChanges(), 
                HELP: current.experiment.settings.helpLink,
            }}
        >
            <ParamsNotebook bind:this={settingsNotebook} element={current.experiment.settings}></ParamsNotebook>
        </Dialog>
        {/if}
        <RibbonSwitchButton 
            labels={["Pilot", "Run"]} 
            bind:state={
                () => current.experiment.pilotMode,
                (value) => {
                    // update history
                    current.experiment.history.update()
                    // set pilot mode
                    current.experiment.settings.params['runMode'].val = value;
                }
            } 
            disabled={current.experiment === null}
        />        
    </RibbonSection>

    <!-- <RibbonSection id=desktop label=Desktop icon="/icons/{theme}/rbn-desktop.svg">
        <RibbonButton id="ribbon-btn-compilepy" icon="/icons/{theme}/btn-compilepy.svg" label="Compile to Python" />
        <RibbonButton id="ribbon-btn-{$experiment.pilotMode ? "pilotpy" : "runpy"}" icon="/icons/{theme}/btn-{$experiment.pilotMode ? "pilotpy" : "runpy"}.svg" label="{$experiment.pilotMode ? "Pilot" : "Run"} in Python" />
    </RibbonSection> -->

    <!-- <RibbonSection id=browser label=Browser icon="/icons/{theme}/rbn-browser.svg">
        <RibbonButton 
            id="ribbon-btn-compilejs" 
            icon="/icons/{theme}/btn-compilejs.svg" 
            label="Compile to JavaScript" 
        />
        <RibbonButton 
            id="ribbon-btn-{$experiment.pilotMode ? "pilotjs" : "runjs"}" 
            icon="/icons/{theme}/btn-{$experiment.pilotMode ? "pilotjs" : "runjs"}.svg" 
            label="{$experiment.pilotMode ? "Pilot" : "Run"} in browser" 
        />
        <RibbonButton 
            id="ribbon-btn-sync" 
            icon="/icons/{theme}/btn-sync.svg" 
            label="Sync to Pavlovia" 
        />
    </RibbonSection> -->

    <RibbonSection label=Pavlovia icon="/icons/{theme}/rbn-pavlovia.svg">
        ToddOST
        No project
    </RibbonSection>

    <RibbonGap></RibbonGap>

    <RibbonSection label=Views icon="/icons/{theme}/rbn-windows.svg">
        <RibbonButton 
            icon="/icons/{theme}/btn-builder.svg" 
            label="Builder view" 
            onclick={new_builder_frame} 
        />
        <RibbonButton 
            icon="/icons/{theme}/btn-coder.svg" 
            label="Coder view" 
            onclick={new_coder_frame} 
        />
        <RibbonButton 
            icon="/icons/{theme}/btn-runner.svg" 
            label="Runner view" 
            onclick={new_runner_frame} 
        />
    </RibbonSection>
</Ribbon>