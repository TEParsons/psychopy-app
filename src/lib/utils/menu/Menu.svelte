<script>
    import { getContext, setContext } from 'svelte';
    import Menu from '@smui/menu';

    /** @prop @type {any} Arbitrary data associated with this menu */
    export const data = {};

    /**
     * @public 
     * Open this menu
     * 
     * @param value {boolean} Whether or not this menu should be open (default is true)
    */
    export function setOpen(value=true) {
        // open/close this menu
        handles.menu.setOpen(value)
        // open/close parent menu
        if (parent) {
            parent.setOpen(value)
        }
    }

    /** @public @type {Array<object>} Arbitrary data to associated with each item, array can be supplied or bound */
    export let itemData = [];
    setContext("itemData", itemData)
    /** @private @type {{container: HTMLDivElement|undefined, menu: import("@smui/menu").default|undefined, setOpen: function}} If this menu has a parent menu, its handles will appear here */
    let parent = getContext("handles")
    /** @public @type {{container: HTMLDivElement|undefined, menu: import("@smui/menu").default|undefined, setOpen: function}} Handles of the HTML elements corresponding to this component, object can be supplied or bound */
    export let handles = {
        container: undefined, 
        menu: undefined,
        setOpen: setOpen,
    };
    setContext("handles", handles)
</script>

<div 
    bind:this={handles.container}
    class=menu-container 
>
    <div 
        class=menu-outer
    >
        <Menu 
            bind:this={handles.menu}
        >
            <div 
                class=menu-inner
            >
                <slot></slot>
            </div>
        </Menu>
    </div>
</div>

<style>
.menu-inner {
    display: grid;
    grid-template-columns: [items] min-content [submenus] min-content;
    grid-column-start: submenus;
}
.menu-outer {
    position: absolute;
    border: 1px solid var(--overlay);
    background-color: var(--base);
    z-index: 100;
    left: 100%;
    top: -1px;
}
.menu-container {
    position: relative;
    z-index: 100;
}
:global(.mdc-menu-surface) {
    display: none;
}
:global(.mdc-menu-surface--open) {
    display: block;
}

</style>