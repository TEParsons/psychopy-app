<script>
    import { theme } from '../globals.js'
    import { pilot_mode, file, modified } from './globals.js';
    import Ribbon from '../utils/ribbon/Ribbon.svelte'
    import RibbonSection from '../utils/ribbon/Section.svelte'
    import RibbonButton from '../utils/ribbon/Button.svelte'
    import RibbonSwitchButton from '../utils/ribbon/Switch.svelte'

    /* File */

    /* Edit */

    /* Experiment */

    function toggle_pilot_mode() {
        pilot_mode.set(!$pilot_mode)
    }

    /* Views */

    function new_builder_frame() {
        window.open("/builder");
    }
    function new_coder_frame() {
        window.open("/coder");
    }
    function new_runner_frame() {
        window.open("/runner");
    }

    
</script>

<Ribbon>
    <RibbonSection id=file label=File icon="/icons/{$theme}/rbn-file.svg">
        <RibbonButton id="ribbon-btn-new" icon="/icons/{$theme}/btn-new.svg" label="New file" />
        <RibbonButton id="ribbon-btn-open" icon="/icons/{$theme}/btn-open.svg" label="Open file"on:click={file_open} />
        <RibbonButton id="ribbon-btn-save" icon="/icons/{$theme}/btn-save.svg" label="Save file" disabled={$file === null} />
        <RibbonButton id="ribbon-btn-saveas" icon="/icons/{$theme}/btn-saveas.svg" label="Save file as"/>        
    </RibbonSection>

    <RibbonSection id=edit label=Edit icon="/icons/{$theme}/rbn-edit.svg">
        <RibbonButton id="ribbon-btn-undo" icon="/icons/{$theme}/btn-undo.svg" label="Undo" disabled={!$modified} />
        <RibbonButton id="ribbon-btn-redo" icon="/icons/{$theme}/btn-redo.svg" label="Redo" />
        <RibbonButton id="ribbon-btn-find" icon="/icons/{$theme}/btn-find.svg" label="Find" />
    </RibbonSection>

    <RibbonSection id=experiment label=Script icon="/icons/{$theme}/rbn-experiment.svg">       
        <RibbonButton id="ribbon-btn-colors" icon="/icons/{$theme}/btn-colors.svg" label="Color picker" />        
        <RibbonSwitchButton id="ribbon-btn-pilot-toggle" left=Pilot right=Run state={pilot_mode} on:click={toggle_pilot_mode} />        
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-sendpilot" icon="/icons/{$theme}/btn-sendpilot.svg" label="Send to runner" />
        {:else}
        <RibbonButton id="ribbon-btn-sendrun" icon="/icons/{$theme}/btn-sendrun.svg" label="Send to runner" />
        {/if}
    </RibbonSection>

    <RibbonSection id=desktop label=Desktop icon="/icons/{$theme}/rbn-desktop.svg">
        <RibbonButton id="ribbon-btn-monitors" icon="/icons/{$theme}/btn-monitors.svg" label="Monitor centre" />
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-pilotpy" icon="/icons/{$theme}/btn-pilotpy.svg" label="Pilot in Python" disabled={!$file.endsWith(".py")} />
        {:else}
        <RibbonButton id="ribbon-btn-runpy" icon="/icons/{$theme}/btn-runpy.svg" label="Run in Python" disabled={!$file.endsWith(".py")} />
        {/if}
    </RibbonSection>

    <RibbonSection id=browser label=Browser icon="/icons/{$theme}/rbn-browser.svg">
        {#if $pilot_mode}
        <RibbonButton id="ribbon-btn-pilotjs" icon="/icons/{$theme}/btn-pilotjs.svg" label="Pilot in browser" disabled={!$file.endsWith(".js")} />
        {:else}
        <RibbonButton id="ribbon-btn-runjs" icon="/icons/{$theme}/btn-runjs.svg" label="Run in browser" disabled={!$file.endsWith(".js")} />
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