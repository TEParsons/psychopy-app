<script>
    import { getContext } from "svelte";
    import { ButtonTab, Notebook, NotebookPage } from "$lib/utils/notebook";
    import CodeEditor from "$lib/utils/code/CodeEditor.svelte";

    let current = getContext("current")
</script>

<Notebook>
    {#each Object.entries(current.pages) as [i, page]}
        <NotebookPage
            bind:label={page.label}
            close={(evt) => current.pages.splice(i, 1)}
            bind:selected={
                () => current.tab === i,
                (val) => {
                    if (val) {
                        current.tab = i
                    }
                }
            }
        >
            <CodeEditor
                theme=psychopy-light
                bind:value={page.content}
                bind:handle={page.editor}
            ></CodeEditor>
        </NotebookPage>
    {/each}
    <ButtonTab
        callback={(evt) => {
            // add new tab with blank file
            current.pages.push({
                file: "untitled.py",
                content: ""
            })
            // focus new tab
            current.tab = $state.snapshot(current.pages.length) - 1
        }}
        tooltip="New file..."
    ></ButtonTab>
</Notebook>