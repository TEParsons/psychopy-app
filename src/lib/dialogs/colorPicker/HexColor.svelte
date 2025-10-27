<script>
    let {
        value=$bindable(),
        target="param"
    } = $props();

    let rgb = $state([
        255, 255, 255
    ])
    
    $effect(() => {
        value = target === "param" ? `#${new Uint8Array(rgb).toHex()}` : `"#${new Uint8Array(rgb).toHex()}"`
    })
</script>

<div class=page>
    <div class=ctrls>
        {#each Object.keys(rgb) as i}
            <div class=ctrl>
                <div class=label>
                    {[
                        "Red",
                        "Blue",
                        "Green"
                    ][i]}
                </div>
                <input 
                    type=number 
                    bind:value={rgb[i]}
                    min=0
                    max=255
                />
                <code class=output>
                    = {new Uint8Array([rgb[i]]).toHex()}
                </code>
            </div>
        {/each}
    </div>
    <div 
        class=preview
        style:background-color={value}
    ></div>
</div>

<style>
    .page {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        width: 100%;
    }
    .ctrls {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        flex-grow: 1;
    }
    .ctrl .label {
        grid-column-end: end;
        grid-column-start: start;
    }
    .ctrl {
        display: grid;
        grid-template-columns: [start] 1fr max-content[end];
        gap: .25rem .5rem;
        align-items: center;
    }
    .preview {
        width: 10rem;
        border: 1px solid var(--overlay);
    }
</style>