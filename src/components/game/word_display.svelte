<script lang=ts>
    import { SvelteMap } from "svelte/reactivity";
    import { titleCase } from "../../lib/utils";

    const {
        word
    }:{
        word: string
    } = $props()

    const shown_letters = $state(new SvelteMap())

    export function showCharacter(char: string){
        shown_letters.set(char, undefined)
    }
</script>


<section class="word-display">
    {#each titleCase(word) as character}
        <div class:space={character == ' '}>
            {#if character != ' ' && shown_letters.has(character.toLowerCase())}
                {character}
            {/if}
        </div>
    {/each}
</section>


<style lang="scss">
    @use "../../styling/variables" as *;

    section{
        display: flex;
        gap: 10px;

        & > div{
            @include UI_Card($background-opacity: 10%);

            place-content: center;
            aspect-ratio: 14/19;
            font-size: 3rem;
            line-height: 0;
            display: grid;
            padding: 10px;
            height: 6rem;

            &.space{
                visibility: hidden;
                opacity: 0;
                width: 0px;
            }
        }
    }
</style>