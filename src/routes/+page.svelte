<script>
    import { electron } from "$lib/globals.svelte";
    import { newWindow } from "$lib/utils/views.js"
</script>

<div class=container>
    <svg class=background>
        <use href="/branding/component-wave.svg"></use>
    </svg>
    <nav>
        <button 
            class=view
            aria-label="builder"
            onclick={evt => newWindow("builder")}
        >
            <h3>Builder</h3>
            <svg class=icon>
                <use href="/icons/btn-builder.svg"></use>
            </svg>
            <p>Generate experiments easily using an intuitive graphical user interface (GUI).</p>
        </button>
        <button 
            class=view
            aria-label="coder"
            onclick={evt => newWindow("coder")}
        >
            <h3>Coder</h3>
            <svg class=icon>
                <use href="/icons/btn-coder.svg"></use>
            </svg>
            <p>Write and edit code directly in a variety of languages.</p>
        </button>
        {#if electron}
            <button 
                class=view
                aria-label="runner"
                onclick={evt => newWindow("runner")}
            >
                <h3>Runner</h3>
                <svg class=icon>
                    <use href="/icons/btn-runner.svg"></use>
                </svg>
                <p>Coordinate running experiments and scripts and view any warnings generated.</p>
            </button>
        {/if}
    </nav>
</div>

<style>
    .container {
        position: fixed;
        left: 0; right: 0; top: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--mantle);
    }
    .background {
        position: absolute;
        width: 120%;
        min-width: 1080px;
        z-index: -1;
        object-fit: contain;
        opacity: 50%;
    }
    nav {
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 2rem;
        padding: 4rem;
        margin: auto;
        z-index: 1;
    }
    .view {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: .5rem;

        width: 15rem;
        padding: 1rem;
        border: 1px solid var(--overlay);
        border-radius: 1rem;
        background-color: var(--base);
    }
    .icon {
        height: 10rem;
    }

    button:enabled:hover,
    button:enabled:focus {
        outline: none;
        border-color: var(--blue);
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.05)
        ;
    }
</style>