<script lang="ts">
    import MainMenu from "./components/screens/main_menu.svelte";
    import Settings from "./components/screens/settings.svelte";
    import Game from "./components/screens/game.svelte";
    import { onMount } from "svelte";

    import { decryptObject } from "./lib/encyption";

    let state: globalState = $state({"screen": "main-menu", data: undefined})

    onMount(async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const gameKey = urlParams.get('gamekey')
        if(gameKey == undefined)
            return

        try {
            const data = await decryptObject(atob(gameKey))

            state = {
                "screen": "game",
                "data": {
                    "word": data["word"],
                    "category": data["category"]
                }
            }
        } catch (error) {
            console.warn(error)
        }
    })
</script>

{#if state.screen == "main-menu"}
    <MainMenu bind:gState={state}/>
{:else if state.screen == "settings"}
    <Settings bind:gState={state}/>
{:else if state.screen == "game"}
    <Game bind:gState={state} word={state.data["word"]} category={state.data["category"]}/>
{/if}