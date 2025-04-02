<script>
    import Menu from '@smui/menu';

    export let menu = undefined;

</script>

<div class=menu-container>
    <div class=menu-outer>
        <Menu bind:this={menu}>
            <div class=menu-inner>
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
}
:global(.mdc-menu-surface) {
    display: none;
}
:global(.mdc-menu-surface--open) {
    display: block;
}

</style>