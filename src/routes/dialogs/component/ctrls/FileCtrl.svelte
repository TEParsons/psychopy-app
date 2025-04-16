<script>
    import { theme } from "$lib/globals";
    import Button from "./elements/Button.svelte";
    export let param;

    function getFile() {
        // todo: add functionality to get file
        return
    }
</script>

<div class="file-ctrl param-value">
    <input type="text" bind:value={param.val} />
    <Button icon="/icons/{$theme}/btn-open.svg" on:click={getFile}/>
</div>

<style>
    @import url("paramCtrl.css");

    .file-ctrl {
        display: grid;
        gap: .5rem;
        grid-template-columns: auto min-content;
    }

</style>