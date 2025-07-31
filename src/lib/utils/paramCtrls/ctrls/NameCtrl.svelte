<script>
    import TextInput from "./elements/TextInput.svelte";

    let {
        param
    } = $props()

    export function validate(param) {
        return !String(param.val).includes(" ")
    }

</script>

<div class="name-ctrl param-value">
    <TextInput
        param={param}
        validate={validate}
    ></TextInput>
</div>

<style>
    @import url("./paramCtrl.css");
</style>