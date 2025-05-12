<script>
    import { writable } from "svelte/store";

    export let param;
    export let ctrl;


    export let isCode = writable(param.valType === "code");
    export let isValid = writable(true);

    function validate(evt) {
        isValid.set(param.isValid())
    }

    function checkCode(evt) {
        isCode.set(param.isCode())
    }

</script>

<input 
    class=param-text-input 
    type="text" 
    bind:value={param.val} 
    bind:this={ctrl} 
    on:input={validate}
    on:input={checkCode}
    on:input
    class:error={!$isValid} 
    class:code={$isCode} 
/>

<style>
    .error {
        color: var(--red);
    }
    .code {
        font-family: var(--mono);
        font-weight: bold;
    }
</style>