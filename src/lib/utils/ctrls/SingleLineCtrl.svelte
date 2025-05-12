<script>
    import { writable } from "svelte/store";

    export let param;


    let isCode = writable(param.valType === "code");
    let isValid = writable(true);

    function onChange(evt) {
        console.log(param.isCode(), param.isValid())
        isCode.set(param.isCode())
        isValid.set(param.isValid())
    }

</script>

<input 
    class=param-value 
    type="text" 
    bind:value={param.val} 
    on:input={onChange}
    class:valid={$isValid} 
    class:code={$isCode} 
/>

<style>
    @import url("paramCtrl.css");

    .error {
        color: var(--red);
    }
    .code {
        font-family: var(--mono);
        font-weight: bold;
    }
</style>