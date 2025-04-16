<script>
    import { get, writable } from "svelte/store";
    import namedColors from "./namedColors.json";

    export let selected = writable();    

    function rgb2rgb255(value) {
        
        let output = value.slice(0, 3).map(
            (val) => {
                return Math.ceil(
                    (val + 1) / 2 * 255
                )
            }
        )
        if (value.length > 3) {
            output.push(Math.round(value[3] * 255))
        } else {
            output.push(255)
        }

        return output
    }

    function contrastColor(value) {
        let lum = value.slice(0, 3).reduce(
            (counter, val) => counter + val, 0
        ) / 3
        if (value.length > 3) {
            lum += 1 - value[3]
        }

        if (lum > 0) {
            return "black"
        } else {
            return "white"
        }
    }
</script>

<div class=named-color-ctrl>
{#each Object.entries(namedColors) as [name, color] }
    <button 
        id="named-color-{name}"
        on:click={() => selected.set(name)} 
        style="background-color: rgba({rgb2rgb255(color)}); color: {contrastColor(color)};"
        class:active={$selected === name}
    >
    <div class=overlay style="background-color: rgba({rgb2rgb255(color)})"></div>
    <label for="named-color-{name}">
        {name}
    </label>
    </button>
{/each}
</div>

<style>
    .named-color-ctrl {
        display: flex;
        flex-wrap: wrap;
        width: 30rem;
        justify-content: center;
    }
    button .overlay {
        position: absolute;
        left: 0; right: 0; top: 0; bottom: 0;
        z-index: 0;
    }
    button label {
        z-index: 1;
        font-family: var(--mono);
    }
    button {
        position: relative;
        background-image: url("/transparent.svg");
        background-repeat: repeat;
        background-attachment: fixed;
        overflow: hidden;
        border: .25rem solid var(--base);
    }
    button.active {
        border: .25rem solid var(--blue);
    }
</style>

