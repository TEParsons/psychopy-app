
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/builder" | "/builder/components" | "/builder/flow" | "/builder/flow/controls" | "/builder/ribbon" | "/builder/routines" | "/coder" | "/coder/files" | "/coder/notebook" | "/coder/ribbon" | "/coder/shell" | "/runner" | "/runner/outputs" | "/runner/ribbon";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/builder": Record<string, never>;
			"/builder/components": Record<string, never>;
			"/builder/flow": Record<string, never>;
			"/builder/flow/controls": Record<string, never>;
			"/builder/ribbon": Record<string, never>;
			"/builder/routines": Record<string, never>;
			"/coder": Record<string, never>;
			"/coder/files": Record<string, never>;
			"/coder/notebook": Record<string, never>;
			"/coder/ribbon": Record<string, never>;
			"/coder/shell": Record<string, never>;
			"/runner": Record<string, never>;
			"/runner/outputs": Record<string, never>;
			"/runner/ribbon": Record<string, never>
		};
		Pathname(): "/" | "/builder" | "/builder/" | "/builder/components" | "/builder/components/" | "/builder/flow" | "/builder/flow/" | "/builder/flow/controls" | "/builder/flow/controls/" | "/builder/ribbon" | "/builder/ribbon/" | "/builder/routines" | "/builder/routines/" | "/coder" | "/coder/" | "/coder/files" | "/coder/files/" | "/coder/notebook" | "/coder/notebook/" | "/coder/ribbon" | "/coder/ribbon/" | "/coder/shell" | "/coder/shell/" | "/runner" | "/runner/" | "/runner/outputs" | "/runner/outputs/" | "/runner/ribbon" | "/runner/ribbon/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | "/icons/btn-add-many.svg" | "/icons/btn-add.svg" | "/icons/btn-builder.svg" | "/icons/btn-case.svg" | "/icons/btn-clear.svg" | "/icons/btn-coder.svg" | "/icons/btn-color.svg" | "/icons/btn-colors.svg" | "/icons/btn-compilejs.svg" | "/icons/btn-compilepy.svg" | "/icons/btn-copy.svg" | "/icons/btn-delete.svg" | "/icons/btn-devices.svg" | "/icons/btn-download.svg" | "/icons/btn-edit.svg" | "/icons/btn-filter.svg" | "/icons/btn-find.svg" | "/icons/btn-hamburger.svg" | "/icons/btn-loop.svg" | "/icons/btn-monitors.svg" | "/icons/btn-new.svg" | "/icons/btn-open.svg" | "/icons/btn-pilotjs.svg" | "/icons/btn-pilotpy.svg" | "/icons/btn-redo.svg" | "/icons/btn-refresh.svg" | "/icons/btn-regex.svg" | "/icons/btn-routine.svg" | "/icons/btn-runjs.svg" | "/icons/btn-runner.svg" | "/icons/btn-runpy.svg" | "/icons/btn-save.svg" | "/icons/btn-saveas.svg" | "/icons/btn-sendpilot.svg" | "/icons/btn-sendrun.svg" | "/icons/btn-settings.svg" | "/icons/btn-sort.svg" | "/icons/btn-sync.svg" | "/icons/btn-table.svg" | "/icons/btn-target.svg" | "/icons/btn-undo.svg" | "/icons/btn-upload.svg" | "/icons/components/ApertureComponent.svg" | "/icons/components/AudioValidatorRoutine.svg" | "/icons/components/BrushComponent.svg" | "/icons/components/ButtonBoxComponent.svg" | "/icons/components/ButtonComponent.svg" | "/icons/components/CameraComponent.svg" | "/icons/components/CodeComponent.svg" | "/icons/components/CounterbalanceRoutine.svg" | "/icons/components/DotsComponent.svg" | "/icons/components/EyetrackerCalibrationRoutine.svg" | "/icons/components/EyetrackerRecordComponent.svg" | "/icons/components/EyetrackerValidationRoutine.svg" | "/icons/components/FormComponent.svg" | "/icons/components/GratingComponent.svg" | "/icons/components/ImageComponent.svg" | "/icons/components/JoyButtonsComponent.svg" | "/icons/components/JoystickComponent.svg" | "/icons/components/KeyboardComponent.svg" | "/icons/components/MicrophoneComponent.svg" | "/icons/components/MouseComponent.svg" | "/icons/components/MovieComponent.svg" | "/icons/components/PanoramaComponent.svg" | "/icons/components/ParallelOutComponent.svg" | "/icons/components/PavloviaSurveyRoutine.svg" | "/icons/components/PolygonComponent.svg" | "/icons/components/ProgressComponent.svg" | "/icons/components/RegionOfInterestComponent.svg" | "/icons/components/ResourceManagerComponent.svg" | "/icons/components/SerialOutComponent.svg" | "/icons/components/SliderComponent.svg" | "/icons/components/SoundComponent.svg" | "/icons/components/SoundSensorComponent.svg" | "/icons/components/StaticComponent.svg" | "/icons/components/TextboxComponent.svg" | "/icons/components/TextComponent.svg" | "/icons/components/VariableComponent.svg" | "/icons/components/VisualValidatorRoutine.svg" | "/icons/ctrl-switch-down.svg" | "/icons/ctrl-switch-left.svg" | "/icons/ctrl-switch-right.svg" | "/icons/ctrl-switch-up.svg" | "/icons/dynamicize.py" | "/icons/param-update-constant.svg" | "/icons/param-update-eachframe.svg" | "/icons/param-update-eachrepeat.svg" | "/icons/param-update-static.svg" | "/icons/rbn-browser.svg" | "/icons/rbn-desktop.svg" | "/icons/rbn-edit.svg" | "/icons/rbn-experiment.svg" | "/icons/rbn-file.svg" | "/icons/rbn-pavlovia.svg" | "/icons/rbn-plugin.svg" | "/icons/rbn-windows.svg" | "/icons/sym-arrow-down-hl.svg" | "/icons/sym-arrow-down.svg" | "/icons/sym-arrow-left-hl.svg" | "/icons/sym-arrow-left.svg" | "/icons/sym-arrow-right-hl.svg" | "/icons/sym-arrow-right.svg" | "/icons/sym-arrow-up-hl.svg" | "/icons/sym-arrow-up.svg" | "/icons/sym-dot-blue.svg" | "/icons/sym-dot-dark.svg" | "/icons/sym-dot-green.svg" | "/icons/sym-dot-light.svg" | "/icons/sym-dot-orange.svg" | "/icons/sym-dot-red.svg" | "/icons/sym-info.svg" | "/icons/sym-pending.svg" | "/style.css" | "/transparent.svg" | string & {};
	}
}