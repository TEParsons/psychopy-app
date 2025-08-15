<script>
    import { file, modified } from './globals.js';
    import { Ribbon, RibbonSection, RibbonButton, RibbonSwitchButton } from '$lib/utils/ribbon';

    /* File */

    /* Edit */

    /* Experiment */

    function toggle_experiment.pilotMode() {
        experiment.pilotMode.set(!$experiment.pilotMode)
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
    <RibbonSection id=file label=File icon="/icons/rbn-file.svg">
        <RibbonButton id="ribbon-btn-new" icon="/icons/btn-new.svg" label="New file" />
        <RibbonButton id="ribbon-btn-open" icon="/icons/btn-open.svg" label="Open file"on:click={file_open} />
        <RibbonButton id="ribbon-btn-save" icon="/icons/btn-save.svg" label="Save file" disabled={$file === null} />
        <RibbonButton id="ribbon-btn-saveas" icon="/icons/btn-saveas.svg" label="Save file as"/>        
    </RibbonSection>

    <RibbonSection id=edit label=Edit icon="/icons/rbn-edit.svg">
        <RibbonButton id="ribbon-btn-undo" icon="/icons/btn-undo.svg" label="Undo" disabled={!$modified} />
        <RibbonButton id="ribbon-btn-redo" icon="/icons/btn-redo.svg" label="Redo" />
        <RibbonButton id="ribbon-btn-find" icon="/icons/btn-find.svg" label="Find" />
    </RibbonSection>

    <RibbonSection id=experiment label=Script icon="/icons/rbn-experiment.svg">       
        <RibbonButton id="ribbon-btn-colors" icon="/icons/btn-colors.svg" label="Color picker" />        
        <RibbonSwitchButton id="ribbon-btn-pilot-toggle" left=Pilot right=Run state={experiment.pilotMode} on:click={toggle_experiment.pilotMode} />        
        {#if $experiment.pilotMode}
        <RibbonButton id="ribbon-btn-sendpilot" icon="/icons/btn-sendpilot.svg" label="Send to runner" />
        {:else}
        <RibbonButton id="ribbon-btn-sendrun" icon="/icons/btn-sendrun.svg" label="Send to runner" />
        {/if}
    </RibbonSection>

    <RibbonSection id=desktop label=Desktop icon="/icons/rbn-desktop.svg">
        <RibbonButton id="ribbon-btn-monitors" icon="/icons/btn-monitors.svg" label="Monitor centre" />
        {#if $experiment.pilotMode}
        <RibbonButton id="ribbon-btn-pilotpy" icon="/icons/btn-pilotpy.svg" label="Pilot in Python" disabled={!$file.endsWith(".py")} />
        {:else}
        <RibbonButton id="ribbon-btn-runpy" icon="/icons/btn-runpy.svg" label="Run in Python" disabled={!$file.endsWith(".py")} />
        {/if}
    </RibbonSection>

    <RibbonSection id=browser label=Browser icon="/icons/rbn-browser.svg">
        {#if $experiment.pilotMode}
        <RibbonButton id="ribbon-btn-pilotjs" icon="/icons/btn-pilotjs.svg" label="Pilot in browser" disabled={!$file.endsWith(".js")} />
        {:else}
        <RibbonButton id="ribbon-btn-runjs" icon="/icons/btn-runjs.svg" label="Run in browser" disabled={!$file.endsWith(".js")} />
        {/if}
        <RibbonButton id="ribbon-btn-sync" icon="/icons/btn-sync.svg" label="Sync to Pavlovia" />
    </RibbonSection>

    <RibbonSection id=pavlovia label=Pavlovia icon="/icons/rbn-pavlovia.svg">
        ToddOST
        No project
    </RibbonSection>

    <RibbonSection gap></RibbonSection>

    <RibbonSection id=views label=Views icon="/icons/rbn-windows.svg">
        <RibbonButton id="ribbon-btn-builder"  icon="/icons/btn-builder.svg" label="Builder view" on:click={new_builder_frame} />
        <RibbonButton id="ribbon-btn-coder"  icon="/icons/btn-coder.svg" label="Coder view" on:click={new_coder_frame} />
        <RibbonButton id="ribbon-btn-runner" icon="/icons/btn-runner.svg" label="Runner view" on:click={new_runner_frame} />
    </RibbonSection>
</Ribbon>