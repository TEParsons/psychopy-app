<script>
    let {
        param
    } = $props()

    let valLabelMap = []
    if (param.allowedVals instanceof Array) {
        param.allowedVals.forEach((val, i) => {
            let label;
            if (param.allowedLabels && i < param.allowedLabels.length) {
                label = param.allowedLabels[i];
            } else {
                label = val;
            }
            valLabelMap.push([val, label])
        })
    }
    
</script>

<select class=param-value disabled={param.allowedVals.length == 1} bind:value={param.val}>
    {#each [...valLabelMap] as [val, label]}
    <option value={val} selected={param.val === val}>{label}</option>
    {/each}
</select>

<style>
    @import url("paramCtrl.css");
</style>