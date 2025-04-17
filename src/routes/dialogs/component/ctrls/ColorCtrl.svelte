<script>
    import { theme } from "$lib/globals";
    import Button from "./elements/Button.svelte";
    import Dialog from "../../colorPicker/Dialog.svelte";
    import { writable } from "svelte/store";
    export let param;

    let dialog;
    let dlgCurrent = writable();
    let dlgValue = writable();
    dlgValue.subscribe((val) => {
        if (val !== undefined) {
            param.val = val;
        }
    })
</script>

<div class="file-ctrl param-value">
    <input type="text" bind:value={param.val} />
    <Button 
        icon="/icons/{$theme}/btn-color.svg" 
        on:click={() => {
            // reset dialog value
            dlgCurrent.set(param.val);
            // show dialog
            dialog.showModal();
        }}
    />

    <Dialog id=color-picker bind:handle={dialog} bind:value={dlgValue} bind:current={dlgCurrent} />
</div>

<style>
    @import url("paramCtrl.css");

    .file-ctrl {
        display: grid;
        gap: .5rem;
        grid-template-columns: auto min-content;
    }

</style>