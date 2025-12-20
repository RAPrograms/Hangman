<script lang="ts">
    import MainMenu from "./components/screens/main_menu.svelte";
    import Settings from "./components/screens/settings.svelte";

    let state: globalState = $state({"screen": "main-menu", data: undefined})
</script>

{#if state.screen == "main-menu"}
    <MainMenu gState={state}/>
{:else if state.screen == "settings"}
    <Settings gState={state}/>
{:else if state.screen == "game"}
    TODO
{/if}