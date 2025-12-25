<script lang="ts">
    import Keyboard from "../keyboard.svelte";

    const { 
        word,
        category
    }:{
        word: string,
        category: string
    } = $props()

    const total_lives = 6
    let lives = $state(total_lives)

    function validateLetter(letter: string): boolean{
        const correct = word.toLowerCase().includes(letter.toLowerCase())
        if(!correct)
            lives -= 1
        return correct
    }
</script>

<main>
    <header>
        <h1>Hangman</h1>
        <p>Guess the word before you run out of attempts</p>
    </header>

    <section>
        <div>Remaining Attempts</div>
        <div>{lives}</div>
        <div>
            {#each {length: total_lives} as _, i}
                {@const used = (i + 1) <= lives}
                <span class:used={!used}>
                    {#if used} 
                        ❤️
                    {:else}
                        💔
                    {/if}
                </span>
            {/each}
        </div>
    </section>
</main>

<div>{word} from {category}</div>

<Keyboard validator={validateLetter}/>

<style lang="scss">
    @use "../../styling/variables" as *;

    main{
        & > header{
            flex-direction: column;
            display: flex;
            gap: 10px;

            & > h1{
                font-size: 1.3rem;
            }
        }

        & > section{
            @include UI_Card($background-opacity: 40%);

            display: grid; 
            grid-auto-columns: 1fr; 
            grid-template-columns: max-content 1fr; 
            grid-template-rows: max-content 1fr; 
            padding: 20px;
            gap: 10px; 
            grid-template-areas: 
                "Title Title"
                "Number Symboles"; 

            & > :nth-child(1){
                grid-area: Title;
                text-align: left;
                font-size: 1.3rem;
                color: var(--faint-colour);
            }

            & > :nth-child(2){
                grid-area: Number;
                font-size: 2rem;
            }

            & > :nth-child(3){
                justify-content: right;
                align-items: center;
                grid-area: Symboles;
                text-align: right;
                display: flex;
                gap: 7px;

                & > *{
                    outline: 1px solid color-mix(in hsl shorter hue, var(--faint-colour) 20%, transparent);
                    border-radius: 100%;
                    aspect-ratio: 1/1;
                    padding: 5px;
                    font-size: 1rem;
                    height: 2rem;
                    display: grid;
                    place-items: center;
                    line-height: 0;

                    &:not(.used){
                        background-color: color-mix(in hsl shorter hue, rgb(0, 77, 170) 50%, transparent);
                    }

                    &.used{
                        background-color: rgb(21, 28, 40);
                    }
                }
            }
        }
    }
</style>