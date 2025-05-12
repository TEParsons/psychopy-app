<script>
    import { theme } from "$lib/globals.js";

    export let id = undefined;
    export let icon = null;
    export let label;
    export let submenu = false;
    export let action = () => {};
    export let closemenu = null;
    export let disabled = false;
</script>


<button 
    id={id}
    class=menu-item 
    on:click={() => {
        action();
        if (closemenu !== null) {
            closemenu.setOpen(false);
        }
    }}
    disabled={disabled}
>
    {#if icon !== null}
    <img src={icon} alt="-" class=menu-item-icon />
    {/if}
    <label for={id}>{label}</label>
    {#if submenu}
    <img class=menu-item-chevron src="/icons/{$theme}/sym-arrow-right.svg" alt=">" />
    {/if}
</button>

<style>
    .menu-item {
        /* position within menu */
        grid-column-start: items;
        /* own attributes */
        display: grid;
        grid-template-columns: [icon] 1rem [label] 1fr [chevron] 1rem;
        gap: 0 .5rem;
        width: 100%;
        white-space: nowrap;
        margin: 0;
        background-color: transparent;
        border-radius: 0;
        padding: 0.5rem 1rem;
    }
    .menu-item label {
        grid-column-start: label;
    }
    .menu-item:enabled:hover {
        background-color: var(--mantle);
    }

    .menu-item-chevron {
        width: .4rem;
        margin-left: auto;
    }

</style>