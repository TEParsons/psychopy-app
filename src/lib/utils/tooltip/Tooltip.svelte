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
        style:inset={{
            "top": "auto auto calc(100% + .5rem) auto",
            "bottom": "calc(100% + .5rem) auto auto auto",
            "left": "auto calc(100% + .5rem) auto auto",
            "right": "auto auto auto calc(100% + .5rem)",
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
    }

    :global(*:hover) > .tooltip,
    :global(*:focus) > .tooltip {
        transition: visibility linear 0s var(--tooltip-delay);
        visibility: visible;
    }
</style>