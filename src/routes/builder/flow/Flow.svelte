<script>
    import { theme } from '../../globals.js';
    import Loop from './Loop.svelte'
</script>

<div class="flow">
    <div class=flowline-container>
        <div class=flowline></div>
        <img class=flowline-arrow src="/icons/{$theme}/sym-arrow-right.svg" alt="<"/>
    </div>
    <slot></slot>
</div>

<style>
    .flow {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: start;
        gap: 1rem;
        padding: 2rem;
        padding-top: 0;
    }
    .flowline-container {
        border-left: 2px solid var(--outline);
        position: absolute;
        top: -1rem;
        left: 0;
        right: 0;
        z-index: 0;
    }
    .flowline {
        border-top: 1px solid var(--outline);
        margin: 1rem 0;
    }
    .flowline-arrow {
        position: absolute;
        left: 100%;
        top: calc(.5rem - 1px);
        width: .75rem;
    }
</style>