<script>
    import SingleLineCtrl from "./SingleLineCtrl.svelte"
    import { CompactButton, IconButton } from "$lib/utils/buttons"
    import { getContext } from "svelte";
    import Dialog from "$lib/utils/dialog/Dialog.svelte";
    import { PavloviaUsers } from "$lib/pavlovia/pavlovia.svelte";

    let {
        /** @prop @type {import("$lib/experiment/experiment.svelte.js").Param} Param object to which this ctrl pertains */
        param,
        /** @prop @type {boolean} Controls whether this control is disabled */
        disabled=false,
        /** @bindable State tracking whether this param's value is valid */
        valid=$bindable(),
        /** @prop @type {Function} Function to check whether this param's value is valid */
        validate = (param) => [true, ""],
    } = $props()

    let current = getContext("current")

    let showSurveysDlg = $state.raw();

    let selected = $state({
        survey: undefined
    });

    let surveys = $state({
        available: [],
        error: undefined
    });

    async function populateSurveys() {
        // clear surveys
        surveys.available = []
        surveys.error = undefined
        // populate
        if (current.user) {
            // todo: how the hell does fetch work?
            let resp;
            try {
                resp = await fetch(
                    "https://pavlovia.org/api/v2/surveys",
                    {
                        headers: current.user.token
                    }
                )
            } catch (err) {
                surveys.error = err;
                return
            }
            let data = await resp.json()
            // if we got any, show them
            if ("surveys" in data) {
                for (let survey of data.surveys) {
                    surveys.available.push(survey)
                }
            }
        }
    }

</script>

<SingleLineCtrl 
    param={param} 
    validate={validate}
    bind:valid={valid}
    disabled={disabled}
/>

<CompactButton 
    icon="icons/btn-find.svg"
    tooltip="Browse your projects on Pavlovia"
    onclick={(evt) => showSurveysDlg = true}
    disabled={disabled || current.user === undefined}
/>

<Dialog
    id=browse-surveys
    title="Pavlovia surveys"
    onopen={populateSurveys}
    buttons={{
        OK: (evt) => param.val = selected.survey.surveyId,
        CANCEL: (evt) => {}
    }}
    buttonsDisabled={{
        OK: selected.survey === undefined
    }}
    bind:shown={showSurveysDlg}
>
    <div class=container>
        <p>
            Below are all of the surveys linked to your Pavlovia account - select the one you want and press OK to add its ID.
        </p>
        <div class=choice-group>
            {#each surveys.available as survey}
                <button
                    class=survey-option
                    onclick={(evt) => selected.survey = survey}
                    class:selected={selected.survey && selected.survey.surveyId === survey.surveyId}
                >
                    {survey.surveyName}
                </button>
            {/each}
            {#if surveys.error}
            <p class=error>

            </p>
            {/if}
        </div>
        <div class=ctrls>
            <IconButton
                label="Manage surveys on Pavlovia"
                icon="icons/rbn-pavlovia.svg"
                onclick={(evt) => window.open("https://pavlovia.org/dashboard?tab=4")}
            />
            <IconButton
                label="Refresh available surveys"
                icon="icons/btn-refresh.svg"
                onclick={populateSurveys}
            />
        </div>
    </div>
</Dialog>

<style>
    .container {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;
    }

    .choice-group {
        background: var(--base);
        border: 1px solid var(--overlay);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex-grow: 1;
        overflow-y: auto;
    }

    .survey-option {
        background-color: transparent;
        border: 1px solid transparent;
        padding: .5rem;
    }
    .survey-option:hover,
    .survey-option:focus {
        border-color: var(--blue);
    }
    .survey-option.selected {
        background-color: var(--blue);
        color: var(--text-on-blue);
    }

    .ctrls {
        display: flex;
        flex-direction: row;
        gap: .5rem;
        padding: .5rem;
        padding-bottom: 1.5rem;
    }

    p.error {
        color: var(--red);
    }

</style>