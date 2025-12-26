<script lang="ts">
    const { lives = $bindable(6), total_lives = 6 }:{
        lives: number | undefined,
        total_lives: number
    } = $props()
</script>

<section>
    <div>Remaining Attempts</div>
    <div>{Math.max(lives, 0)}</div>
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

<style lang="scss">
    @use "../../styling/variables" as *;

    $layout_breakpoint: 400px;

    section{
        @include UI_Card($background-opacity: 40%);

        min-width: min(95vw, 500px);
        max-width: 95vw;
        padding: 20px;
        gap: 10px; 


        @media (width >= $layout_breakpoint) {
            grid-template-columns: max-content 1fr; 
            grid-template-rows: max-content 1fr; 
            grid-auto-columns: 1fr; 
            display: grid; 
            grid-template-areas: 
                "Title Title"
                "Number Symboles"; 
        }

        @media (width < $layout_breakpoint) {
            flex-direction: column;
            display: flex;
        }

        & > :nth-child(1){
            color: var(--faint-colour);
            font-size: 1.3rem;
            grid-area: Title;
            
            @media (width >= 400px) {
                text-align: left;
            }
        }

        & > :nth-child(2){
            grid-area: Number;
            font-size: 2rem;
        }

        & > :nth-child(3){
            align-items: center;
            grid-area: Symboles;
            text-align: right;
            display: flex;
            gap: 7px;
            
            @media (width >= $layout_breakpoint) {
                justify-content: right;
            }

            @media (width < $layout_breakpoint) {
                justify-content: center;
            }

            & > *{
                outline: 1px solid color-mix(in hsl shorter hue, var(--faint-colour) 20%, transparent);
                border-radius: 100%;
                place-items: center;
                aspect-ratio: 1/1;
                font-size: 1rem;
                line-height: 0;
                display: grid;
                padding: 5px;
                height: 2rem;

                &:not(.used){
                    background-color: color-mix(in hsl shorter hue, rgb(0, 77, 170) 50%, transparent);
                }

                &.used{
                    background-color: rgb(21, 28, 40);
                }
            }
        }
    }
</style>