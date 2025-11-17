<script>
    import { Icon } from "$lib/utils/icons";
    import { fly } from "svelte/transition";
    let {
        message,
        icon=undefined
    } = $props()
</script>


<div 
    class=message
    transition:fly
>
    {#if icon}
        <Icon 
            src={icon}
            size=1.5em
        />
    {/if}
    {message}
</div>

<style>
    .message {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .5rem;
        background-color: var(--outline);
        color: var(--base);
        border-radius: .5rem;
        padding: .5rem 1rem;
    }
</style>