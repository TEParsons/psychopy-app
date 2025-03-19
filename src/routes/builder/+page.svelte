<script>
    import { theme } from '../globals.js';
    import { pilot_mode, experiment } from './globals.js';
    import Panel from '../utils/Panel.svelte';
    import Frame from '../utils/Frame.svelte';

    import Ribbon from './Ribbon.svelte';
    import Menu from './Menu.svelte';
    import RoutinesNotebook from './routines/Notebook.svelte';
    import ComponentsPanel from './components/Panel.svelte';
    import FlowPanel from './flow/Panel.svelte';
</script>

<Frame rows=3 cols=4>
    <Ribbon slot=ribbon></Ribbon>
    <Menu></Menu>

    <Panel id=routine-pnl title=Routines hspan=3 vspan=2>
        <RoutinesNotebook></RoutinesNotebook>
    </Panel>
    <Panel id=components-pnl title=Components vspan=2>
        <ComponentsPanel></ComponentsPanel>
    </Panel>
    <Panel id=flow-pnl title=Flow hspan=4>
        <FlowPanel></FlowPanel>
    </Panel>
</Frame>

<style>
    :global(#routine-pnl) {
        grid-column-end: span 2;
        grid-row-end: span 2;
    }
    :global(#components-pnl) {
        grid-column-end: span 1;
        grid-row-end: span 2;
    }
    :global(#flow-pnl) {
        grid-column-end: span 3;
        grid-row-end: span 1;
    }
</style>