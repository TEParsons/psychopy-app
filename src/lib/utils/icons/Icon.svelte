<script>
    let {
        src,
        size="100%",
        /** @prop @type {boolean} Are we awaiting execution of anything for this icon? */
        awaiting=$bindable()
    } = $props()

    // transform source to a URL
    let url = $derived.by(() => {
        if (String(src).match(/.*\.svg/g)) {
            // if already looks like a url, return as is
            return src
        } else {
            // blobbify data to get around cross-origin security nonsense
            let blob = new Blob([src], {type: 'image/svg+xml'})
            
            return URL.createObjectURL(blob);  
        }
    })
</script>


<svg 
    class=icon
    style:width={size}
    style:height={size}
>
    {#await awaiting}
        <use href="/icons/sym-pending.svg#animation"></use>
    {:then}
        <use href={url}></use>
    {:catch}
        <use href="/icons/sym-error.svg"></use>
    {/await}
    
</svg>
