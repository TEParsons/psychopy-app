<div class=tooltip>
    <slot></slot>
</div>

<style>
    .tooltip {
        position: absolute;
        left: calc(100% + 1rem); top: 0;
        min-width: 20rem;
        opacity: 95%;
        background-color: var(--outline);
        border: 1px solid var(--base);
        color: var(--text-on-outline);
        border-radius: .5rem;
        padding: .5rem 1rem;
        /* hidden until hovered */
        visibility: hidden;
    }

    :global(*:hover > .tooltip) {
        visibility: visible;
    }
</style>