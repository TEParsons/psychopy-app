<script>
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    import { ParamsNotebook } from "$lib/utils/paramCtrls/index.js";

    let {
        /** @prop @type {import("$lib/experiment.svelte.js")<Component|StandaloneRoutine|LoopInitiator>} Element which this dialog edits */
        element,
        /** @bindable State controlling this dialog's visibility */
        shown=$bindable(),
        /** @prop @type {function} Function to execute when this dialog closes */
        onclose=(evt) => {}
    } = $props()

    let notebook;

</script>


<Dialog 
    id="{element.name}-parameters"
    title="Editing: {element.name}"
    bind:shown={shown} 
    onclose={onclose}
    onopen={() => notebook.setRestorePoint()}
    buttons={{
        OK: () => {}, 
        APPLY: () => notebook.setRestorePoint(), 
        CANCEL: () => notebook.applyRestorePoint(), 
        HELP: element.helpLink,
    }}
>
    <ParamsNotebook bind:this={notebook} element={element}></ParamsNotebook>
</Dialog>