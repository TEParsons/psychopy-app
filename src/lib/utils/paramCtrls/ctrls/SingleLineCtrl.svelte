<script>
    import { writable } from "svelte/store";
    import { TextInput } from "./elements";

    export let param;
    let ctrl;

    let isCode = writable(param.valType === "code");
    let isValid = writable(true);

</script>

<input 
    class=param-value 
    type="text" 
    bind:value={param.val} 
    on:input={onChange}
    class:valid={$isValid} 
    class:code={$isCode} 
/>
<div class="single-line-ctrl param-value">
    <TextInput
        param={param}
        bind:ctrl={ctrl}
        bind:isValid={isValid}
        bind:isCode={isCode}
    ></TextInput>
</div>

<style>
    @import url("./paramCtrl.css");
</style>