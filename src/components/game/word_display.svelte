<script lang=ts>
    import { SvelteMap } from "svelte/reactivity";
    import { titleCase } from "../../lib/utils";

    const {
        word
    }:{
        word: string
    } = $props()

    const shown_letters = $state(new SvelteMap())

    let display: HTMLElement
    let scale = $state(.89)

    export function showCharacter(char: string){
        shown_letters.set(char, undefined)
    }

    function wordResizer(){
        const scaleDiffrence = Math.round((1 - scale) * 1000) / 1000
        
        const size = display.getBoundingClientRect().width
        const originalSize = size * (1 + scaleDiffrence)

        if(originalSize < screen.width){
            scale = 1
            return
        }

        scale = 1 - ((originalSize - screen.width) / originalSize)
    }
</script>

<svelte:window onresize={wordResizer}/>

<section class="word-display" style:scale={scale} bind:this={display}>
    {#each titleCase(word).split(" ") as section}
        <div class="section">
            {#each section as character}
                <span>
                    {#if shown_letters.has(character.toLowerCase())}
                        {character}
                    {/if}
                </span>
            {/each}
        </div>
    {/each}
</section>


<style lang="scss">
    @use "../../styling/variables" as *;

    section{
        justify-content: center;
        width: fit-content;
        flex-wrap: wrap;
        gap: 20px 40px;
        display: flex;

        & > div.section{
            display: flex;
            gap: 10px;


            & > span{
                @include UI_Card($background-opacity: 10%);

                place-content: center;
                aspect-ratio: 14/19;
                font-size: var(--font-size, 3rem);
                line-height: 0;
                display: grid;
                padding: 10px;
                height: 6rem;
            }
        }
    }
</style>