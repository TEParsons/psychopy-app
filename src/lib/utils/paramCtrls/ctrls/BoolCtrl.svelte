<script>
    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable()
    } = $props()
</script>

<input 
    class=param-bool-input 
    type="checkbox" 
    bind:checked={param.val} 
    disabled={disabled}
/>

<style>
input[type=checkbox] {
    flex-grow: 0;
    align-self: center;
}
</style>