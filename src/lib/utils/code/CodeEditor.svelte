<!-- credit to github@ala-garbaa-pro/svelte-5-monaco-editor-two-way-binding -->


<script>
	import loader from '@monaco-editor/loader';
	import { onDestroy, onMount } from 'svelte';

	import LightTheme from "./themes/light.json";
	import DarkTheme from "./themes/dark.json";
    import { sanitize } from './themes/utils';

	let editor;
	let monaco;
	let editorContainer;

	let {
		value=$bindable(),
		handle=$bindable(),
		language='python',
		theme='vs-light'
	} = $props();

	onMount(() => {
		(async () => {
			// Remove the next two lines to load the monaco editor from a CDN
			// see https://www.npmjs.com/package/@monaco-editor/loader#config
			const monacoEditor = await import('monaco-editor');
			loader.config({ monaco: monacoEditor.default });

			monaco = await loader.init();

			// setup themes
			monaco.editor.defineTheme('psychopy-light', sanitize(LightTheme));
			monaco.editor.defineTheme('psychopy-dark', sanitize(DarkTheme));

			// Your monaco instance is ready, let's display some code!
			editor = monaco.editor.create(editorContainer, {
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
			handle = editor;

			editor.onDidChangeModelContent((e) => {
				if (e.isFlush) {
					// true if setValue call
					//console.log('setValue call');
					/* editor.setValue(value); */
				} else {
					// console.log('user input');
					const updatedValue = editor?.getValue() ?? ' ';
					value = updatedValue;
				}
			});
		})();
	});

	$effect(() => {
		if (value) {
			if (editor) {
				// check if the editor is focused
				if (editor.hasWidgetFocus()) {
					// let the user edit with no interference
				} else {
					if (editor?.getValue() ?? ' ' !== value) {
						editor?.setValue(value);
					}
				}
			}
		}
		if (value === '') {
			editor?.setValue(' ');
		}
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((model) => model.dispose());
		editor?.dispose();
	});
</script>

<div class="container" bind:this={editorContainer}></div>

<style>
	.container {
		width: 100%;
		height: 600px;
		padding: 0;
		border-radius: 50px;
	}
</style>