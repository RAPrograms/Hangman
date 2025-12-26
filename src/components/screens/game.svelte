<script lang="ts">
    import LivesDisplay from "../game/lives_display.svelte";
    import WordDisplay from "../game/word_display.svelte";
    import Keyboard from "../keyboard.svelte";
    import Model from "../model.svelte";

    import { encryptObject } from "../../lib/encyption";
    import { onMount } from "svelte";

    let { 
        word,
        category,
        gState = $bindable()
    }:{
        word: string,
        category: string,
        gState: globalState
    } = $props()

    let chars_to_guess: number

    let display: WordDisplay
    let model: Model

    const total_lives = 6
    let lives = $state(total_lives)

    onMount(() => {
        chars_to_guess = word.split("").reduce((map, char) => {
            if(!map.has(char))
                map.set(char, undefined)

            return map
        }, new Map()).size
    })

    function validateLetter(letter: string): boolean{
        const correct = word.toLowerCase().includes(letter.toLowerCase())
        if(correct)
            chars_to_guess -= 1

        else
            lives -= 1

        if(lives <= 0 || chars_to_guess <= 0)
            model.prompt("game-end")

        display.showCharacter(letter)

        return correct
    }

    async function generatePlayLink(){
        const url = window.location
        const gamekey = btoa(await encryptObject({ word, category}))
        return `${url.protocol}//${url.host}?gamekey=${gamekey}`
    }
</script>

{#snippet GameEndModel(handler: (e: Event) => void, cancel: () => void)}
    <header>
        <h1>
            {#if lives > 0}
                You got it!
            {:else}
                You’ve been hanged! 😭
            {/if}
        </h1>
    </header>
    <div>
        <p>The word was "<b>{word}</b>"</p>
        {#if category == undefined}
            <p>As a <b>custom</b> word</p>
        {:else}
            <p>From "<b>{category}</b>" category</p>
        {/if}
    </div>
    <div class="buttons">
        <button style="--accent-colour: rgb(251, 100, 182)" onclick={async () => {
            const link = await generatePlayLink()
            window.prompt("Share this link with you friends", link);
        }}>Share Game with a Friend</button>
        <button style="--accent-colour: rgb(81, 162, 255)" onclick={() => {
            cancel()
            gState = {"screen": "main-menu", data: undefined}
        }}>Close</button>
    </div>
{/snippet}

<Model bind:this={model} pages={{"game-end": GameEndModel}}/>

<div class="game">

    <main>
        <header>
            <h1>Hangman</h1>
            <p>Guess the word before you run out of attempts</p>
        </header>

        <LivesDisplay bind:lives={lives} {total_lives}/>

        <WordDisplay bind:this={display} {word}/>
    </main>
    
    <Keyboard validator={validateLetter}/>
</div>


<style lang="scss">
    @use "../../styling/variables" as *;

    div.game{
        justify-content: space-between;
        min-height: 100vh;
        padding: 20px 0;

        &, & > main, & > main > header{
            flex-direction: column;
            display: flex;
        }

        & > main{
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            gap: 30px;

            & > header{
                flex-direction: column;
                margin-bottom: 20px;
                display: flex;
                gap: 10px;

                & > h1{
                    font-size: 1.9rem;
                }

                & > p{
                    color: var(--faint-colour);
                }
            }
        }
    }
</style>