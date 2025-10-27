<script>
    let {
        value=$bindable(),
        target="param"
    } = $props();

    let rgb = $state([
        1, 1, 1
    ])

    // transform the PsychoPy RGB values (-1:1) into CSS RGB (0:255) for the preview
    let preview = $derived(
        rgb.map(val => (val + 1) * 255 / 2)
    )
    
    $effect(() => {
        value = target === "param" ? `$[${rgb.join(", ")}]` : `[${rgb.join(", ")}]`
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
                    min={-1}
                    max=1
                    step=0.05
                />
            </div>
        {/each}
    </div>
    <div 
        class=preview
        style:background-color=rgba({preview})
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