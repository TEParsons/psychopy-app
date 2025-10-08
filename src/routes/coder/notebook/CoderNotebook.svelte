<script>
    import { getContext, onMount } from "svelte";
    import { ButtonTab, Notebook, NotebookPage } from "$lib/utils/notebook";
    import CodeEditor from "$lib/utils/code/CodeEditor.svelte";

    var media = $state({
        prefersColorScheme: "light"
    });
    onMount(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            media.prefersColorScheme = event.matches ? "dark" : "light";
        });
    })

    let current = getContext("current")
</script>

<Notebook>
    {#each Object.entries(current.pages) as [i, page]}
        <NotebookPage
            bind:label={page.label}
            close={(evt) => current.pages.splice(i, 1)}
            bind:selected={
                () => current.tab === parseInt(i),
                (val) => {
                    if (val) {
                        current.tab = parseInt(i)
                    }
                }
            }
        >
            <CodeEditor
                theme="psychopy-{media.prefersColorScheme}"
                bind:value={page.content}
                bind:editor={page.editor}
                bind:canUndo={page.canUndo}
                bind:canRedo={page.canRedo}
            ></CodeEditor>
        </NotebookPage>
    {/each}
    <ButtonTab
        callback={current.newFile}
        tooltip="New file..."
    ></ButtonTab>
</Notebook>