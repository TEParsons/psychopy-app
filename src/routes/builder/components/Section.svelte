<script>
    import PanelButton from '$lib/utils/buttons/PanelButton.svelte';
import { writable } from 'svelte/store';

    export let id;
    export let label;

    export var shown = writable(false)

    function toggle_shown() {
        shown.set(!$shown)
    }
</script>

<PanelButton
    label={label}
>
    <div class=component-section-buttons>
        <slot></slot>
    </div>
</PanelButton>

<style>
    section {
        margin: .5rem 0;
    }
    button {
        background-color: var(--crust);
    }
    button.component-section-btn {
        border-radius: 0;
        padding: .5rem;
        width: 100%;
        margin: 0;
    }
    .component-section-buttons {
        display: flex;
        flex-wrap: wrap;
        padding: 1rem;
        gap: .5rem;
    }
</style>