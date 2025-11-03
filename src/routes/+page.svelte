<script>
    import { electron, python } from "$lib/globals.svelte";
    import { newWindow } from "$lib/utils/views.js";
    import { Icon } from "$lib/utils/icons";
    import { asset } from "$app/paths";

    // handle initial setup
    let ready = $state({
        status: true,
        message: ""
    })
    
    if (python) {
        // mark as not ready until plugins are activated
        ready.status = false
        ready.message = "Activating plugins..."
        // activate plugins
        python.liaison.send({
            command: "run",
            args: ["psychopy.plugins:activatePlugins"]
        }, 10000).then(
            resp => {
                ready.status = true;
                ready.message = ""
            }
        ).catch(
            err => {
                ready.status = true;
                ready.message = `Failed to activate plugins: ${err}`
            }
        )
    } else {
        ready.status = true
    }
</script>

<div class=container>
    <svg class=background>
        <use href={asset("/branding/component-wave.svg")}></use>
    </svg>
    <nav>
        <button 
            class=view
            aria-label="builder"
            onclick={evt => newWindow("builder")}
            disabled={!ready.status}
        >
            <h3>Builder</h3>
            <Icon 
                src="/icons/btn-builder.svg"
                size="10rem";
            />
            <p>Generate experiments easily using an intuitive graphical user interface (GUI).</p>
        </button>
        <button 
            class=view
            aria-label="coder"
            onclick={evt => newWindow("coder")}
            disabled={!ready.status}
        >
            <h3>Coder</h3>
            <Icon 
                src="/icons/btn-coder.svg"
                size="10rem";
            />
            <p>Write and edit code directly in a variety of languages.</p>
        </button>
        {#if electron}
            <button 
                class=view
                aria-label="runner"
                onclick={evt => newWindow("runner")}
                disabled={!ready.status}
            >
                <h3>Runner</h3>
                <Icon 
                    src="/icons/btn-runner.svg"
                    size="10rem";
                />
                <p>Coordinate running experiments and scripts and view any warnings generated.</p>
            </button>
        {/if}
    </nav>
    <div class=message>
        {ready.message}
    </div>
</div>

<style>
    .container {
        position: fixed;
        left: 0; right: 0; top: 0; bottom: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 4rem;
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

    button:enabled:hover,
    button:enabled:focus {
        outline: none;
        border-color: var(--blue);
        box-shadow: 
            inset 1px 1px 10px rgba(0, 0, 0, 0.05)
        ;
    }

    button:disabled {
        background-color: var(--crust);
        color: var(--outline);
    }
</style>