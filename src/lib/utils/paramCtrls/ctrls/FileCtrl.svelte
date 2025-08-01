<script>
    import { theme } from "$lib/globals.svelte.js";
    import { writable } from "svelte/store";
    import { Button, TextInput } from "./elements";
    export let param;

    let ctrl;
    let isValid = writable(true);

    function getFile() {
        // todo: add functionality to get file
        return
    }

    function validate() {
        if (!String(param.val).includes("/")) {
            isValid.set(false)
        }
    }
</script>

<div class="file-ctrl param-value">
    <TextInput 
        param={param} 
        bind:ctrl={ctrl} 
        bind:isValid={isValid}
        on:input={validate}
    />
    <Button icon="/icons/{theme}/btn-open.svg" on:click={getFile}/>
</div>

<style>
    @import url("paramCtrl.css");

    .file-ctrl {
        grid-template-columns: auto min-content;
    }

</style>