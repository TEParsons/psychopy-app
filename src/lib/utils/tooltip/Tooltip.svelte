<script>
    /** @prop @type {number} Delay before showing this tooltip */
    export let delay = 0.5;
</script>


<div 
    class=tooltip
    style="--tooltip-delay: {delay}s"
>
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
        z-index: 10;
        font-weight: normal;
        /* hidden until hovered */
        visibility: hidden;
        transition: visibility linear 0s 0s;
    }

    :global(*:hover) > .tooltip,
    :global(*:focus) > .tooltip {
        transition: visibility linear 0s var(--tooltip-delay);
        visibility: visible;
    }
</style>