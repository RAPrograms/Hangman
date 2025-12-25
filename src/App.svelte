<script lang="ts">
    import MainMenu from "./components/screens/main_menu.svelte";
    import Settings from "./components/screens/settings.svelte";
    import Game from "./components/screens/game.svelte";

    let state: globalState = $state({"screen": "main-menu", data: undefined})
</script>

{#if state.screen == "main-menu"}
    <MainMenu bind:gState={state}/>
{:else if state.screen == "settings"}
    <Settings bind:gState={state}/>
{:else if state.screen == "game"}
    <Game bind:gState={state} word={state.data["word"]} category={state.data["category"]}/>
{/if}