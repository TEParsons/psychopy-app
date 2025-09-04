<!-- credit to github@ala-garbaa-pro/svelte-5-monaco-editor-two-way-binding -->


<script>
    import loader from '@monaco-editor/loader';
    import { onDestroy, onMount } from 'svelte';

    import LightTheme from "./themes/light.json";
    import DarkTheme from "./themes/dark.json";
    import { sanitize } from './themes/utils';

    let {
        value=$bindable(),
        editor=$bindable(),
        canUndo=$bindable(),
        canRedo=$bindable(),
        language='python',
        theme='vs-light'
    } = $props();

    let monaco;
    let container;

    onMount(() => {
        (async () => {
            // initialise monaco loader
            monaco = await loader.init();
            // setup themes
            monaco.editor.defineTheme('psychopy-light', sanitize(LightTheme));
            monaco.editor.defineTheme('psychopy-dark', sanitize(DarkTheme));
            // initialise editor
            editor = monaco.editor.create(container, {
                value,
                language,
                theme,
                fontFamily: "JetBrains Mono",
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