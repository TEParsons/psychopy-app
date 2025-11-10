<script>
    import { RadioButton, RadioGroup, CompactButton, Button } from "$lib/utils/buttons"
    import { browseFileOpen } from "$lib/utils/files";
    import { getContext } from "svelte";

    let {
        value=$bindable()
    } = $props();
    
    let current = getContext("current");

    async function addFile(evt) {
        let file = await browseFileOpen([
            { name: "PsychoPy Experiments", extensions: ["psyexp"] },
            { name: "Python Scripts", extensions: ["py"] },
            { name: 'All Files', extensions: ["*"] }
        ])
        if (file) {
            current.experiment.files.push(file)
        }
    }
</script>

<div class=panel>
    <div class=items>
        <RadioGroup
            bind:value={value}
        >
            {#each Object.entries(current.files) as [i, file]}
                <div class=item>
                    <RadioButton 
                        value={file}
                        label="{file.name.length > 40 ? "..." : ""}{file.name.slice(-40)}"
                        icon="/icons/btn-{file.name.endsWith(".psyexp") ? "builder" : "coder"}.svg"
                    />
                    <CompactButton 
                        icon="/icons/btn-delete.svg"
                        onclick={evt => delete current.files[i]}
                    />
                </div>
            {/each}
        </RadioGroup>
    </div>
    <div class=ctrls>
        <Button 
            label="Add file"
            icon="/icons/btn-add.svg"
            onclick={addFile}
            horizontal
        />
    </div>
</div>

<style>
.panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
    height: 100%;
}
.items {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: .5rem;
    flex-grow: 1;
    overflow-y: auto;
}
.item {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: .5rem;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
    width: 100%;
}
.ctrls {
    display: flex;
    flex-direction: row;
    gap: .5rem;
    justify-content: end;
}
</style>