<script>
    import { pilot_mode, experiment, experiment_file } from './globals.js';

    export let name;
</script>

<div>{JSON.stringify($experiment_file.routines.get(name))}</div>