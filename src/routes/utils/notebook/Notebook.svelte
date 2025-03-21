<script>
    import { n_tabs } from './globals.js';

    export let id;

</script>

<div id={id} class=notebook style="--n-tabs: {$n_tabs}">
    <slot></slot>
</div>

<style>
    .notebook {
        display: grid;
        grid-template-rows: [tabs] min-content [page] 1fr;
        grid-template-columns: repeat(var(--n-tabs), min-content) 1fr;
        z-index: 1;
    }
</style>