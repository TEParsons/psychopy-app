<script>
    import Tooltip from "../tooltip/Tooltip.svelte";

    export let label;
    export let icon = undefined;
    export let tooltip = undefined;
    export let horizontal = false;
    export let vertical = false;
    export let disabled = false;
</script>

<button
    on:click
    class:vertical
    class:horizontal
    disabled={disabled}
>
    {#if tooltip}
    <Tooltip>
        {tooltip}
    </Tooltip>
    {/if}
    {#if icon}
    <img 
        class=icon
        src={icon} 
        alt=""
    />
    {/if}
    <span
        class=label
    >{label}</span>
</button>

<style>
    button {
        display: grid;
        position: relative;
        align-items: center;
        padding: 1em;
        
        font-family: var(--body);
        background-color: transparent;
        border: 1px solid var(--overlay);
        border-radius: .5rem;

        max-width: 100%;
        max-height: 100%;

        transition: border-color .2s;
    }

    button.horizontal {
        grid-template-columns: [icon] min-content [label] max-content;
        justify-content: start;
    }
    button.horizontal .icon {
        width: 2rem;
        margin-right: .5rem;
        grid-column-start: icon;
    }
    button.horizontal .label {
        grid-column-start: label;
    }

    button.vertical {
        grid-template-rows: [icon] min-content [label] min-content;
        justify-items: center;
    }
    button.vertical .icon {
        height: 3rem;
        margin-bottom: .5rem;
        grid-row-start: icon;
    }
    button.vertical .label {
        grid-row-start: label;
        hyphens: auto;
    }

    button:disabled {
        opacity: 50%;
    }
    button:enabled:hover,
    button:enabled:focus {
        outline: none;
        border-color: var(--blue);
    }    
</style>