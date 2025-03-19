<script>
    import { theme } from '../../globals.js'

    export let label;
    export let id = undefined;
    export let icon = undefined;
    export let submenu = false;
    export let disabled = false;
</script>

<li class=menu-item>
    <button on:click id={id} disabled={disabled}>
        <label for={id}>
            <img class=menu-item-icon src={icon} alt="" />
            <span class=menu-item-text>{label}</span>
            {#if submenu}
            <img class=submenu-arrow src="/icons/{$theme}/sym-arrow-right.svg" alt=">" />
            {/if}
        </label>
    </button>
    <div class=submenu-container hidden>
        <slot name=submenu></slot>
    </div>
</li>

<style>
    .submenu-container {
        padding: 0;
        position: absolute;
        left: 100%;
        top: 0;
    }
    .menu-item {
        position: relative;
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    .menu-item button {
        background-color: var(--base);
        color: var(--text);
        padding: .5rem;
        margin: 0;
        width: 100%;
    }
    .menu-item button:hover {
        background-color: var(--mantle);
        color: var(--mantle-text);
    }
    .menu-item label {
        display: grid;
        grid-template-columns: [icon] min-content [label] max-content [arrow] min-content;
        grid-gap: .5rem;
        align-items: center;
        justify-content: left;
        padding: 0 1rem;
    }
    .menu-item label .menu-item-icon {
        grid-column-start: icon;
        width: 1rem;
    }
    .menu-item label .menu-item-text {
        grid-column-start: label;
    }
    .menu-item label .submenu-arrow {
        grid-column-start: arrow;
        width: .25rem;
    }
    
</style>