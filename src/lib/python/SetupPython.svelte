<script>
    import { Button } from "$lib/utils/buttons";
    import { MessageArray, Message } from "$lib/utils/message";
    import { python } from "$lib/globals.svelte";

    // store progress for setting up Python
    let status = $state({
        ready: Promise.withResolvers(),
        dismiss: Promise.withResolvers(),
        message: "Checking for Python...",
    })
    // once status resolves, dismiss message after a brief pause
    status.ready.promise.finally(
        val => setTimeout(evt => status.dismiss.resolve(val), 2000)
    )

    async function setupPython() {
        // abort if on browser
        if (!python) {
            status.ready.resolve()
            return
        }
        // do we already have UV and Python?
        status.message = "Checking Python..."
        let hasUV = await python.uv.exists().catch(err => status.ready.reject(err))
        let hasPython = await python.uv.findPython().catch(err => status.ready.reject(err))
        // install UV
        if (!hasUV) {
            status.message = "Downloading UV (a Python installer)..."
            await python.uv.installUV().catch(err => status.ready.reject(err))
        }
        // install Python
        if (!hasPython) {
            status.message = "Installing Python..."
            await python.uv.installPython().catch(err => status.ready.reject(err))
        }
        // is Python already running?
        status.message = "Connecting Python"
        if (await python.started()) {
            // mark as connected
            status.message = "Connected Python"
            status.ready.resolve(true)
        } else {
            // start python
            status.message = "Starting Python..."
            await python.start().catch(err => status.ready.reject(err))
            // activatePlugins
            status.message = "Activating plugins..."
            await python.liaison.send({
                command: "run",
                args: ["psychopy.plugins:activatePlugins"]
            }, 20000).catch(err => status.ready.reject(err))
            // mark success
            status.message = "Successfully started Python"
            status.ready.resolve(true)
        }
    }
    setupPython()
</script>


<MessageArray>
    {#await status.ready.promise}
        <Message
            message={status.message}
        />
    {:then didSetup}
        {#await status.dismiss.promise}
            <Message
                message={status.message}
                icon="/icons/sym-python.svg"
            />
        {/await}
    {:catch err}
        <div class=message>
            Failed setup: {err}
            <Button
                label="Try again?"
                icon="/icons/btn-refresh.svg"
                onclick={evt => setup()}
                horizontal
            />
        </div>
    {/await}
</MessageArray>



