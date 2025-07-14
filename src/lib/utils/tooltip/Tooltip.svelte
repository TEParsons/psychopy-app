<script>
    import { slide } from 'svelte/transition';


    let {
        /** State to use to show/hide the tooltip */
        shown=$bindable(false),
        /** @prop @type {number} Delay before showing this tooltip */
        delay = 0.5,
        /** @prop @type {string} Where to show the tooltip, relative to its parent */
        position = "right",
        /** @interface */
        children
    } = $props()
</script>

{#if shown}
    <div 
        class=tooltip
        transition:slide={{axis: "x", delay: delay}}
        style:top={{
            "top": "auto",
            "bottom": "calc(100% + .5rem)",
            "left": "auto",
            "right": "auto",
        }[position]}
        style:bottom={{
            "top": "calc(100% + .5rem)",
            "bottom": "auto",
            "left": "auto",
            "right": "auto",
        }[position]}
        style:left={{
            "top": "auto",
            "bottom": "auto",
            "left": "auto",
            "right": "calc(100% + .5rem)",
        }[position]}
        style:right={{
            "top": "auto",
            "bottom": "auto",
            "left": "calc(100% + .5rem)",
            "right": "auto",
        }[position]}
    >
        {@render children()}
    </div>
{/if}

<style>
    .tooltip {
        position: absolute;
        padding: .25rem .5rem;
        border-radius: .5rem;
        background-color: var(--outline);
        color: var(--text-on-outline);
        text-wrap: nowrap;
/*         
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
        font-weight: normal; */
    }

    :global(*:hover) > .tooltip,
    :global(*:focus) > .tooltip {
        transition: visibility linear 0s var(--tooltip-delay);
        visibility: visible;
    }
</style>