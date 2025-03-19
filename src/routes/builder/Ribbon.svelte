<script>
    import { theme } from '../globals.js'
    import { pilot_mode, experiment, modified } from './globals.js';
    import Menu from './Menu.svelte';
    import Ribbon from '../utils/ribbon/Ribbon.svelte';
    import RibbonSection from '../utils/ribbon/Section.svelte';
    import RibbonButton from '../utils/ribbon/Button.svelte';
    import RibbonSwitchButton from '../utils/ribbon/Switch.svelte';
    import RibbonMenu from '../utils/ribbon/Menu.svelte';

    import { 
        // file
        file_open,
        // experiment
        toggle_pilot_mode,
        // views
        new_builder_frame,
        new_coder_frame,
        new_runner_frame,
    } from './callbacks.js'

    
</script>

<Ribbon>
    <RibbonMenu>
    </RibbonMenu>
    <RibbonSection id=file label=File icon="/icons/{$theme}/rbn-file.svg">
        <RibbonButton id="ribbon-btn-new" icon="/icons/{$theme}/btn-new.svg" label="New file" />
        <RibbonButton id="ribbon-btn-open" icon="/icons/{$theme}/btn-open.svg" label="Open file"on:click={file_open} />
        <RibbonButton id="ribbon-btn-save" icon="/icons/{$theme}/btn-save.svg" label="Save file" disabled={$experiment === null} />
        <RibbonButton id="ribbon-btn-saveas" icon="/icons/{$theme}/btn-saveas.svg" label="Save file as"/>        
    </RibbonSection>

    <RibbonSection id=edit label=Edit icon="/icons/{$theme}/rbn-edit.svg">
        <RibbonButton id="ribbon-btn-undo" icon="/icons/{$theme}/btn-undo.svg" label="Undo" disabled={!$modified} />
        <RibbonButton id="ribbon-btn-redo" icon="/icons/{$theme}/btn-redo.svg" label="Redo" />
        <RibbonButton id="ribbon-btn-find" icon="/icons/{$theme}/btn-find.svg" label="Find" />
    </RibbonSection>
    
    <RibbonSection id=experiment label=Experiment icon="/icons/{$theme}/rbn-experiment.svg">
        <RibbonButton id="ribbon-btn-monitors" icon="/icons/{$theme}/btn-monitors.svg" label="Monitor centre" />        
        <RibbonButton id="ribbon-btn-settings" icon="/icons/{$theme}/btn-settings.svg" label="Experiment settings" />        
        <RibbonSwitchButton id="ribbon-btn-pilot-toggle" left=Pilot right=Run state={pilot_mode} on:click={toggle_pilot_mode} />        
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-sendpilot" icon="/icons/{$theme}/btn-sendpilot.svg" label="Send to runner" />
        {:else}
        <RibbonButton id="ribbon-btn-sendrun" icon="/icons/{$theme}/btn-sendrun.svg" label="Send to runner" />
        {/if}
    </RibbonSection>

    <RibbonSection id=desktop label=Desktop icon="/icons/{$theme}/rbn-desktop.svg">
        <RibbonButton id="ribbon-btn-compilepy" icon="/icons/{$theme}/btn-compilepy.svg" label="Compile to Python" />
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-pilotpy" icon="/icons/{$theme}/btn-pilotpy.svg" label="Pilot in Python" />
        {:else}
        <RibbonButton id="ribbon-btn-runpy" icon="/icons/{$theme}/btn-runpy.svg" label="Run in Python" />
        {/if}
    </RibbonSection>

    <RibbonSection id=browser label=Browser icon="/icons/{$theme}/rbn-browser.svg">
        <RibbonButton id="ribbon-btn-compilejs" icon="/icons/{$theme}/btn-compilejs.svg" label="Compile to JavaScript" />
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-pilotjs" icon="/icons/{$theme}/btn-pilotjs.svg" label="Pilot in browser" />
        {:else}
        <RibbonButton id="ribbon-btn-runjs" icon="/icons/{$theme}/btn-runjs.svg" label="Run in browser" />
        {/if}
        <RibbonButton id="ribbon-btn-sync" icon="/icons/{$theme}/btn-sync.svg" label="Sync to Pavlovia" />
    </RibbonSection>

    <RibbonSection id=pavlovia label=Pavlovia icon="/icons/{$theme}/rbn-pavlovia.svg">
        ToddOST
        No project
    </RibbonSection>

    <RibbonSection gap></RibbonSection>

    <RibbonSection id=views label=Views icon="/icons/{$theme}/rbn-windows.svg">
        <RibbonButton id="ribbon-btn-builder"  icon="/icons/{$theme}/btn-builder.svg" label="Builder view" on:click={new_builder_frame} />
        <RibbonButton id="ribbon-btn-coder"  icon="/icons/{$theme}/btn-coder.svg" label="Coder view" on:click={new_coder_frame} />
        <RibbonButton id="ribbon-btn-runner" icon="/icons/{$theme}/btn-runner.svg" label="Runner view" on:click={new_runner_frame} />
    </RibbonSection>
</Ribbon>