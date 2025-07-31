<script>
    import TextInput from "./elements/TextInput.svelte";

    let {
        param
    } = $props()

    export function validate(param) {
        return true
    }

</script>

<div class="single-line-ctrl param-value">
    <TextInput
        param={param}
        validate={validate}
    ></TextInput>
</div>

<style>
    @import url("./paramCtrl.css");
</style>