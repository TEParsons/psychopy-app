<script>
    import { theme } from '../../globals.js'

    import Item from './Item.svelte'

    function close_menu() {
        document.getElementById("frame-menu").hidden = true;
        document.getElementById("frame-menu-filter").style.display = "none";
    }
</script>

<ul class=frame-menu id=frame-menu on:focusout={close_menu} hidden>
    <button class=back-btn id=frame-menu-back on:click={close_menu}>
        <img src="/icons/{$theme}/sym-arrow-left.svg" alt="<" />
    </button>
    <slot></slot>
</ul>
<button id=frame-menu-filter on:click={close_menu}></button>

<style>
    .frame-menu {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: auto;
        z-index: 100;
        background-color: var(--base);
        box-shadow: .5rem 0 .5rem rgba(0, 0, 0, 0.1);
        margin: 0;
        padding: 0;
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