<script>
    import { getContext } from "svelte";

    let {
        /** @prop @type {string} Label for this menu item */
        label,
        /** @prop @type {String|undefined} Path to an icon for this page's tab */
        icon=undefined,
        /** 
         * @prop @type {function} Function to call when this item is clicked, given 3 params:
         * 
         * @param evt {MouseEvent} Event triggered on click
         * @param data {any} Arbitrary data associated with this menu item 
         */
        onclick=(evt, data) => {},
        /** @prop @type {any} Arbitrary data associated with this menu item  */
        data={},
        /** @prop @type {boolean} Close menu on click? */
        close=true,
        /** @prop @type {boolean} Is this item able to be clicked on? */
        disabled=$bindable(),
        /** @slot Render an optional submenu on this item */
        submenu=undefined
    } = $props()

    // function to close parent
    let closeMenu = getContext("closeMenu")
</script>


<button  
    class=menu-item 
    onclick={(evt) => {
        // execute the given function, with arbitrary data given on init
        onclick(evt, data);
        // close menu if requested
        if (close) {
            closeMenu()
        }
    }}
    disabled={disabled}
>
    {#if icon}
    <img src={icon} alt="-" class=menu-item-icon />
    {/if}
    <span>{label}</span>
    {@render submenu?.()}
</button>

<style>
    .menu-item {
        /* position within menu */
        grid-column-start: items;
        /* own attributes */
        display: grid;
        position: relative;
        grid-template-columns: [icon] 1rem [label] 1fr [chevron] 1rem;
        align-items: center;
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
    .menu-item:enabled:hover,
    .menu-item:enabled:focus {
        background-color: var(--mantle);
    }
    .menu-item:enabled:focus {
        border: 1px solid var(--blue);
    }

</style>