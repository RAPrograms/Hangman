<script lang="ts">
    import LivesDisplay from "../game/lives_display.svelte";
    import WordDisplay from "../game/word_display.svelte";
    import Keyboard from "../keyboard.svelte";

    const { 
        word,
        category
    }:{
        word: string,
        category: string
    } = $props()

    let display: WordDisplay

    const total_lives = 6
    let lives = $state(total_lives)

    function validateLetter(letter: string): boolean{
        const correct = word.toLowerCase().includes(letter.toLowerCase())
        if(!correct)
            lives -= 1

        display.showCharacter(letter)

        return correct
    }
</script>

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