<script>
    import { theme } from "$lib/globals.svelte.js";
    import { file } from './globals.js';
    import Ribbon from './Ribbon.svelte';
    import Panel from '$lib/utils/Panel.svelte';
    import Frame from '$lib/utils/Frame.svelte';
    import CodeCtrl from '$lib/utils/ctrls/Code.svelte';
</script>

<Frame rows=3 cols=4>
    <Ribbon slot=ribbon/>
    <Panel id=source-pnl title="Source" vspan=3></Panel>
    <Panel id=file-pnl title="File" hspan=3 vspan=2>
        <CodeCtrl lexer="python" />
    </Panel>
    <Panel id=output-pnl title="Output" hspan=3></Panel>
</Frame>

<style>

</style>