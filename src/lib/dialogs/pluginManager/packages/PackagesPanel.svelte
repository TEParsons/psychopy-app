<script>
    import PackageItem from "./PackageItem.svelte";
    import { electron, python } from "$lib/globals.svelte";
    var decoder = new TextDecoder();

    
    import { setContext, untrack } from "svelte";

    let {
        executable=$bindable()
    } = $props()

    let children = $state({
        selected: undefined,
        installed: {},
        all: []
    });
    setContext("siblings", children)

    // cached list of pypi packages
    const pypi = $state([]);
    python.uv.getPackages(executable.current).then(
        resp => {
            for (let key in resp) {
                if (!pypi.includes(key)) {
                    pypi.push(key)
                }
            }
        }
    )

    $effect(() => {
        if (executable.current) {
            python.uv.getPackages(executable.current).then(packages => children.installed = packages)
        }
    })

    let searchterm = $state.raw("");

    function matches(term, name) {
        return (
            name.includes(term.toLowerCase()) ||
            term === ""
        )
    }

    function checkPyPi(term) {
        let promise = Promise.withResolvers()

        fetch(`https://pypi.org/pypi/${term}/json`)
        .then(
            resp => resp.ok ? resp.json().then(data => promise.resolve(data)) : promise.reject(resp.status)
        )

        return promise.promise
    }
</script>

<div class=packages-ctrl>
    <div class=packages-list>
        <input type=search bind:value={searchterm} />
        <!-- installed packages first -->
        {#each Object.keys(children.installed) as name}
            {#if matches(searchterm, name)}
                {#await python.uv.getPackageDetails(name, executable.current)}
                    <div>Loading...</div>
                {:then profile}
                    <PackageItem profile={profile} installed />
                {/await}
            {/if}
        {/each}
        <!-- if search matches a pypi package, include that too -->
        {#if searchterm && !Object.keys(children.installed).includes(searchterm)}
            {#await checkPyPi(searchterm).then(resp => resp)}
                Searching PyPi...
            {:then profile}
                {#if profile}
                    <PackageItem profile={profile} />
                {/if}
            {:catch err}
                {""}
            {/await}
        {/if}
    </div>
    <div class=package-details>
        {@render children.selected?.()}
    </div>
</div>


<style>
    .packages-ctrl {
        display: grid;
        width: 65rem;
        grid-template-columns: 20rem 1fr;
        gap: 2rem;
        padding: 1rem;
    }

    .packages-list {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        overflow-y: auto;
    }
</style>