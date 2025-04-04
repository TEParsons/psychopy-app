<script>
    import { theme } from '../globals.js'
    import { currentFile, experiment } from './globals.js';
    import { changeHistory, changeFuture } from './history.js';
    import Menu from '../utils/menu/Menu.svelte';
    import Item from '../utils/menu/Item.svelte';
    import SubMenu from '../utils/menu/SubMenu.svelte';
    import Ribbon from '../utils/ribbon/Ribbon.svelte';
    import RibbonSection from '../utils/ribbon/Section.svelte';
    import RibbonButton from '../utils/ribbon/Button.svelte';
    import RibbonSwitchButton from '../utils/ribbon/Switch.svelte';

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
        toggle_pilot_mode,
        // views
        new_builder_frame,
        new_coder_frame,
        new_runner_frame,
    } from './callbacks.js'

    import Dialog from '../dialogs/component/Dialog.svelte';

    let settingsDlg;
    let menu;
</script>

<Ribbon>
    <RibbonSection id=ribbon-menu>
        <RibbonButton 
            id=ribbon-menu 
            icon="/icons/{$theme}/btn-hamburger.svg"
            label="Menu"
            on:click={() => menu.setOpen(true)} 
        />
        <Menu 
            bind:menu={menu}
        >
            <SubMenu label="File" icon="/icons/{$theme}/rbn-file.svg">
                <Item 
                    id="ribbon-btn-new" 
                    icon="/icons/{$theme}/btn-new.svg" 
                    label="New file" 
                    action={file_new}
                    closemenu={menu} 
                />
                <Item 
                    id="ribbon-btn-open" 
                    icon="/icons/{$theme}/btn-open.svg" 
                    label="Open file" 
                    action={file_open} 
                    closemenu={menu} 
                />
                <Item 
                    id="ribbon-btn-save" 
                    icon="/icons/{$theme}/btn-save.svg" 
                    label="Save file" 
                    action={file_save} 
                    closemenu={menu} 
                    disabled={!$changeHistory.length} 
                />
                <Item 
                    id="ribbon-btn-saveas" 
                    icon="/icons/{$theme}/btn-saveas.svg" 
                    label="Save file as"
                    action={file_save_as} 
                    closemenu={menu} 
                />
            </SubMenu>
        </Menu>
    </RibbonSection>
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
            disabled={!$changeHistory.length} 
        />
        <RibbonButton 
            id="ribbon-btn-saveas" 
            icon="/icons/{$theme}/btn-saveas.svg" 
            label="Save file as"
            on:click={file_save_as} 
        />
    </RibbonSection>

    <RibbonSection id=edit label=Edit icon="/icons/{$theme}/rbn-edit.svg">
        <RibbonButton 
            id="ribbon-btn-undo" 
            icon="/icons/{$theme}/btn-undo.svg" 
            label="Undo" 
            on:click={undo} 
            disabled={$currentFile === null || !$changeHistory.length} 
        />
        <RibbonButton 
            id="ribbon-btn-redo" 
            icon="/icons/{$theme}/btn-redo.svg" 
            label="Redo" 
            on:click={redo} 
            disabled={$currentFile === null || !$changeFuture.length} 
        />
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
            bind:handle={settingsDlg}
        ></Dialog>
        {/if}
        <RibbonSwitchButton 
            id="ribbon-btn-pilot-toggle" 
            left=Pilot 
            right=Run 
            bind:state={$experiment.pilotMode} 
            on:click={toggle_pilot_mode} 
            disabled={$experiment === null}
        />        
        <!-- <RibbonButton 
            id="ribbon-btn-{$experiment.pilotMode ? "sendpilot" : "sendrun"}" 
            icon="/icons/{$theme}/btn-{$experiment.pilotMode ? "sendpilot" : "sendrun"}.svg" 
            label="Send to runner" 
        /> -->
    </RibbonSection>

    <!-- <RibbonSection id=desktop label=Desktop icon="/icons/{$theme}/rbn-desktop.svg">
        <RibbonButton id="ribbon-btn-compilepy" icon="/icons/{$theme}/btn-compilepy.svg" label="Compile to Python" />
        <RibbonButton id="ribbon-btn-{$experiment.pilotMode ? "pilotpy" : "runpy"}" icon="/icons/{$theme}/btn-{$experiment.pilotMode ? "pilotpy" : "runpy"}.svg" label="{$experiment.pilotMode ? "Pilot" : "Run"} in Python" />
    </RibbonSection> -->

    <!-- <RibbonSection id=browser label=Browser icon="/icons/{$theme}/rbn-browser.svg">
        <RibbonButton 
            id="ribbon-btn-compilejs" 
            icon="/icons/{$theme}/btn-compilejs.svg" 
            label="Compile to JavaScript" 
        />
        <RibbonButton 
            id="ribbon-btn-{$experiment.pilotMode ? "pilotjs" : "runjs"}" 
            icon="/icons/{$theme}/btn-{$experiment.pilotMode ? "pilotjs" : "runjs"}.svg" 
            label="{$experiment.pilotMode ? "Pilot" : "Run"} in browser" 
        />
        <RibbonButton 
            id="ribbon-btn-sync" 
            icon="/icons/{$theme}/btn-sync.svg" 
            label="Sync to Pavlovia" 
        />
    </RibbonSection> -->

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