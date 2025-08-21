<script>
    import { getContext } from "svelte";
    import Namespace from "$lib/namespace.json";
    import SingleLineCtrl from "./SingleLineCtrl.svelte";

    let {
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        valid=$bindable()
    } = $props()

    let current = getContext("current")
    $inspect(current.experiment.namespace)
</script>

<SingleLineCtrl
    param={param}
    checkCode={(param) => false}
    validate={(param) => {
        // must have a value
        if (String(param.val).length === 0) {
            return [false, "Must have a name"]
        }
        // no spaces
        if (String(param.val).includes(" ")) {
            return [false, "Names cannot include spaces"]
        }
        // no protected names
        if (Object.values(Namespace).flat().includes(String(param.val))) {
            return [false, "Name cannot be a protected keyword"]
        }
        // no extant names
        if (String(param.val) in current.experiment.namespace) {
            // ...unless it's extant because it's this name
            if (current.experiment.namespace[String(param.val)] !== param) {
                return [false, "Name already in use"]
            }
        }

        return [true, undefined]
    }}
    bind:valid={valid}
    codeIndicator={false}
    disabled={disabled}
/>