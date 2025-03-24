<script>
    import { theme } from '../globals.js'
    import { pilot_mode, currentFile, modified, experiment } from './globals.js';
    import Menu from './Menu.svelte';
    import Ribbon from '../utils/ribbon/Ribbon.svelte';
    import RibbonSection from '../utils/ribbon/Section.svelte';
    import RibbonButton from '../utils/ribbon/Button.svelte';
    import RibbonSwitchButton from '../utils/ribbon/Switch.svelte';
    import RibbonMenu from '../utils/ribbon/Menu.svelte';

    import {
        // file
        file_new,
        file_open,
        file_save,
        file_save_as,
        // experiment
        toggle_pilot_mode,

        // views
        new_builder_frame,
        new_coder_frame,
        new_runner_frame,
    } from './callbacks.js'

    import Dialog from './dialogs/component/Dialog.svelte';

    let settingsDlg;
    let menu;
</script>

<Ribbon>
    <RibbonMenu menu={menu}>
        <Menu></Menu>
    </RibbonMenu>
    <RibbonSection id=file label=File icon="/icons/{$theme}/rbn-file.svg">
        <RibbonButton 
            id="ribbon-btn-new" 
            icon="/icons/{$theme}/btn-new.svg" 
            label="New file" 
            on:click={file_new}
        />
        <RibbonButton 
            id="ribbon-btn-open" 
            icon="/icons/{$theme}/btn-open.svg" 
            label="Open file" 
            on:click={file_open} 
        />
        <RibbonButton 
            id="ribbon-btn-save" 
            icon="/icons/{$theme}/btn-save.svg" 
            label="Save file" 
            on:click={file_save}
            disabled={$currentFile === null || !$modified} 
        />
        <RibbonButton 
            id="ribbon-btn-saveas" 
            icon="/icons/{$theme}/btn-saveas.svg" 
            label="Save file as" 
            on:click={file_save_as} 
            disabled={$currentFile === null} 
        />        
    </RibbonSection>

    <RibbonSection id=edit label=Edit icon="/icons/{$theme}/rbn-edit.svg">
        <RibbonButton id="ribbon-btn-undo" icon="/icons/{$theme}/btn-undo.svg" label="Undo" disabled={!$modified} />
        <RibbonButton id="ribbon-btn-redo" icon="/icons/{$theme}/btn-redo.svg" label="Redo" />
        <RibbonButton id="ribbon-btn-find" icon="/icons/{$theme}/btn-find.svg" label="Find" />
    </RibbonSection>
    
    <RibbonSection id=experiment label=Experiment icon="/icons/{$theme}/rbn-experiment.svg">
        <!-- <RibbonButton 
            id="ribbon-btn-monitors" 
            icon="/icons/{$theme}/btn-monitors.svg" 
            label="Monitor centre" 
        />         -->
        <RibbonButton 
            id="ribbon-btn-settings" 
            icon="/icons/{$theme}/btn-settings.svg" 
            label="Experiment settings" 
            on:click={() => {settingsDlg.showModal()}}
            disabled={$experiment === null}
        />
        {#if $experiment !== null }
        <Dialog 
            id="dlg-exp-settings"
            component={$experiment.settings} 
            helpLink="" 
            bind:handle={settingsDlg}
        ></Dialog>
        {/if}
        <RibbonSwitchButton 
            id="ribbon-btn-pilot-toggle" 
            left=Pilot 
            right=Run 
            state={pilot_mode} 
            on:click={toggle_pilot_mode} 
            disabled={$experiment === null}
        />        
        <!-- <RibbonButton 
            id="ribbon-btn-{$pilot_mode ? "sendpilot" : "sendrun"}" 
            icon="/icons/{$theme}/btn-{$pilot_mode ? "sendpilot" : "sendrun"}.svg" 
            label="Send to runner" 
        /> -->
    </RibbonSection>

    <!-- <RibbonSection id=desktop label=Desktop icon="/icons/{$theme}/rbn-desktop.svg">
        <RibbonButton id="ribbon-btn-compilepy" icon="/icons/{$theme}/btn-compilepy.svg" label="Compile to Python" />
        <RibbonButton id="ribbon-btn-{$pilot_mode ? "pilotpy" : "runpy"}" icon="/icons/{$theme}/btn-{$pilot_mode ? "pilotpy" : "runpy"}.svg" label="{$pilot_mode ? "Pilot" : "Run"} in Python" />
    </RibbonSection> -->

    <RibbonSection id=browser label=Browser icon="/icons/{$theme}/rbn-browser.svg">
        <!-- <RibbonButton 
            id="ribbon-btn-compilejs" 
            icon="/icons/{$theme}/btn-compilejs.svg" 
            label="Compile to JavaScript" 
        /> -->
        <RibbonButton 
            id="ribbon-btn-{$pilot_mode ? "pilotjs" : "runjs"}" 
            icon="/icons/{$theme}/btn-{$pilot_mode ? "pilotjs" : "runjs"}.svg" 
            label="{$pilot_mode ? "Pilot" : "Run"} in browser" 
        />
        <!-- <RibbonButton 
            id="ribbon-btn-sync" 
            icon="/icons/{$theme}/btn-sync.svg" 
            label="Sync to Pavlovia" 
        /> -->
    </RibbonSection>

    <RibbonSection id=pavlovia label=Pavlovia icon="/icons/{$theme}/rbn-pavlovia.svg">
        ToddOST
        No project
    </RibbonSection>

    <RibbonSection gap></RibbonSection>

    <RibbonSection id=views label=Views icon="/icons/{$theme}/rbn-windows.svg">
        <RibbonButton 
            id="ribbon-btn-builder" 
            icon="/icons/{$theme}/btn-builder.svg" 
            label="Builder view" 
            on:click={new_builder_frame} 
        />
        <RibbonButton 
            id="ribbon-btn-coder"  
            icon="/icons/{$theme}/btn-coder.svg" 
            label="Coder view" 
            on:click={new_coder_frame} 
        />
        <RibbonButton 
            id="ribbon-btn-runner" 
            icon="/icons/{$theme}/btn-runner.svg" 
            label="Runner view" 
            on:click={new_runner_frame} 
        />
    </RibbonSection>
</Ribbon>