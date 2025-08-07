<script>
    let {
        param
    } = $props()
</script>

<input 
    class=param-bool-input 
    type="checkbox" 
    bind:checked={param.val} 
/>

<style>
input[type=checkbox] {
    flex-grow: 0;
    align-self: center;
}
</style>