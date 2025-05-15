<script>
    
    import { getContext } from "svelte";

    /** @prop @type {string} Label for this menu item */
    export let label;
    /** @prop @type {String|undefined} Path to an icon for this page's tab */
    export let icon = undefined;
    /** 
     * @prop @type {function} Function to call when this item is clicked, given 3 params:
     * 
     * @param evt {MouseEvent} Event triggered on click
     * @param handle {HTMLButtonElement} HTML element for this menu item
     * @param data {any} Arbitrary data associated with this menu item 
     */
    export let action = (evt, handle, data) => {};
    /** @prop @type {boolean} Is this item able to be clicked on? */
    export let disabled = false;
    /** @prop @type {boolean} Close menu on click? */
    export let close = true;
    /** @prop @type {any} Arbitrary data associated with this menu item  */
    export let data = {};

    /** @public @type {{button: HTMLButtonElement|undefined}} Handles of the HTML elements corresponding to this component, object can be supplied or bound */
    export let handles = {
        button: undefined
    }

    /** @private @type {{container: HTMLDivElement|undefined, menu: import("@smui/menu")|undefined, setOpen: function}} HTML elements of the parent menu */
    let parent = getContext("handles");
</script>


<button 
    bind:this={handles.button}
    class=menu-item 
    on:click={(evt) => {
        action(evt, handles.button, data);
        if (close) {
            parent.setOpen(false);
        }
    }}
    disabled={disabled}
>
    {#if icon}
    <img src={icon} alt="-" class=menu-item-icon />
    {/if}
    <span>{label}</span>
    <slot name=chevron></slot>
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
    .menu-item span {
        grid-column-start: label;
    }
    .menu-item:enabled:hover {
        background-color: var(--mantle);
    }

</style>