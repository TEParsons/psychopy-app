<script>
    import { writable } from "svelte/store";
    import { TextInput } from "./elements";

    export let param;
    let ctrl;

    let isValid = writable(true);
    let isCode = writable(false);

    function validate() {
        isValid.set(true);
        isCode.set(false);
        return true;
    }

</script>

<div class="name-ctrl param-value">
    <TextInput
        param={param}
        bind:ctrl={ctrl}
        bind:isValid={isValid}
        bind:isCode={isCode}
        on:input={validate}
    ></TextInput>
</div>

<style>
    @import url("paramCtrl.css");
</style>