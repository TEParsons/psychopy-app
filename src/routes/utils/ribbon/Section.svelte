<script>
    export let id = undefined;
    export let label = undefined;
    export let icon = undefined;
    export let gap = false;
</script>

<section id={id} class={gap ? "gap" : ""}>
    {#if label || icon}
    <label for={id}>
        <img alt="" src={icon} />
        {label}
    </label>
    {/if}
    <slot></slot>
</section>

<style>
    section {
        position: relative;
        display: grid;
        grid-template-rows: [buttons] auto [labels] auto;
        padding: 0 1rem 1.5rem 1rem;
        border-left: 1px solid var(--overlay);
        border-right: 1px solid var(--overlay);
    }
    section:first-of-type {
        border-left: none;
        padding-left: 0;
    }
    section:last-of-type {
        border-right: none;
        padding-right: 0;
    }
    section.gap {
        flex-grow: 1;
    }

    section label {
        grid-row-start: labels;
        display: grid;
        position: absolute;
        left: 0; right: 0; bottom: 0;
        grid-template-columns: [icon] min-content [label] auto;
        align-items: center;
        justify-content: center;
        grid-gap: .5em;
        font-size: 1rem;
    }

    section label img {
        height: 16px;
    }
</style>