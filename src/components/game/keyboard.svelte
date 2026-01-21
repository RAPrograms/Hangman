<script lang="ts">
    const { validator }:{
        validator: (letter: string) => boolean
    } = $props()

    const letters: Array<string> = new Array( 26 ).fill( 1 ).map( ( _, i ) => String.fromCharCode( 97 + i ));
    let states: Record<string, boolean> = $state({})

    function processKey(key: string){
        const index = letters.indexOf(key)
        if(index == -1)
            return

        if(states[key] != undefined)
            return

        const correct = validator(key)
        states[key] = correct
    }

    function handleKeyboard(e){
        e.preventDefault()
        processKey(e.key)
    }

    //@ts-ignore
    function handleButton({target}){
        const key = target.getAttribute("data-key")
        processKey(key)
    }

</script>

<svelte:window onkeydown={handleKeyboard}/>

<div>
    {#each letters as key}
        <button
            class:right={states[key] || false}
            class:wrong={(states[key] != undefined)? !states[key] : false}
            data-key={key}
            disabled={states[key] != undefined}
            onclick={handleButton}>
            {key}
        </button>
    {/each}
</div>

<style lang="scss">
    @use "../../styling/variables" as *;

    div{
        justify-content: center;
        align-items: flex-end;
        flex-wrap: wrap;
        max-width: 90vw;
        display: flex;
        gap: 3px;

        & > button{
            @include UI_Card(var(--colour, rgb(50, 77, 118)), var(--opacity, 60%));

            text-transform: uppercase;
            aspect-ratio: 1/1;
            display: block;
            
            @media (width >= 600px) {
                width: clamp(30px, 5vw + 1rem, 75px);
            }

            @media (width < 600px) {
                width: 10vw;
            }

            &:disabled, &.wrong, &.right{
                --opacity: 40%;

                opacity: .7;
            }

            &.right{ --colour: rgb(0, 255, 0, .75); }
            &.wrong{ --colour: rgb(151, 3, 3); }
        }
    }
</style>