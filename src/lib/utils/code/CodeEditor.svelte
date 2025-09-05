<!-- credit to github@ala-garbaa-pro/svelte-5-monaco-editor-two-way-binding -->


<script>
    import loader from '@monaco-editor/loader';
    import { onDestroy, onMount } from 'svelte';
    import themes from "./themes"

    let {
        value=$bindable(),
        editor=$bindable(),
        canUndo=$bindable(),
        canRedo=$bindable(),
        language='python',
        theme='psychopy-light'
    } = $props();

    let monaco;
    let container;

    onMount(() => {
        (async () => {
            // initialise monaco loader
            monaco = await loader.init();
            // setup themes
            for (let [themeName, themeSpec] of Object.entries(themes)) {
                monaco.editor.defineTheme(themeName, themeSpec);
            }
            // initialise editor
            editor = monaco.editor.create(container, {
                value,
                language,
                theme,
                fontFamily: "JetBrains Mono",
                colorDecorators: false,
                lineHeight: 1.6,
                renderLineHighlight: "gutter",
                'bracketPairColorization.enabled': false,
                automaticLayout: true,
                overviewRulerLanes: 0,
                overviewRulerBorder: false,
                wordWrap: 'on',
                minimap: {enabled: false}
            });
            // connect editor value to bound value
            editor.onDidChangeModelContent((e) => {
                if (!e.isFlush) {
                    const updatedValue = editor?.getValue() ?? '';
                    value = updatedValue;
                }
                // update undo/redo bindables
                canUndo = editor.getModel().canUndo();
                canRedo = editor.getModel().canRedo();
            });
            // remeasure fonts once the editor has loaded
            document.fonts.ready.then(() => {
                monaco.editor.remeasureFonts()
            })
        })();
    });

    $effect(() => {
        if (value) {
            if (editor) {
                // only do this if the editor doesn't have focus (as a focused editor will already update the value)
                if (!editor.hasWidgetFocus()) {
                    // update editor value
                    if (editor?.getValue() ?? ' ' !== value) {
                        editor?.setValue(value);
                    }
                }
            }
        } else {
            // make sure there's always at least 1 char
            editor?.setValue(' ');
        }
    });

    onDestroy(() => {
        // unload models on destroy
        monaco?.editor.getModels().forEach(
            (model) => model.dispose()
        );
        editor?.dispose();
    });
</script>

<div class="container" bind:this={container}></div>

<style>
    .container {
        width: calc(100% + 1rem);
        height: calc(100% + 1rem);
        margin: -0.5rem;
    }
</style>