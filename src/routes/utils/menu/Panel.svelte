<script>
    import { theme } from '../../globals.js'

    import Item from './Item.svelte'

    function close_menu() {
        menu.close()
    }

    export let menu;
</script>

<dialog class=frame-menu bind:this={menu}>
    <Item 
        label=""
        id=back
        back 
        on:click={() => { menu.close() }}
    />
    <slot></slot>
</dialog>

<style>
    .frame-menu {
        z-index: 100;
        background-color: var(--base);
        box-shadow: .5rem 0 .5rem rgba(0, 0, 0, 0.1);
        margin: 1rem;
    }
    .back-btn {
        margin: 0;
        background-color: var(--base);
        color: var(--text);
    }
    .back-btn:hover {
        background-color: var(--mantle);
        color: var(--mantle-text);
    }
    .back-btn img {
        width: .5rem;
    }
    #frame-menu-filter {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        margin: 0;
        display: none;
        z-index: 99;
    }
</style>