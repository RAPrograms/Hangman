<script lang="ts">
    const letters = new Array( 26 ).fill( 1 ).map( ( _, i ) => {return {
        key: String.fromCharCode( 65 + i ),
        used: false
    }} );

    function handleKeyboard(e){
        const key = e.key.toUpperCase()

        const index = letters.findIndex(e => e.key == key)
        if(index == -1)
            return

        e.preventDefault()

        if(letters[index].used)
            return

        letters[index].used = true
    }

    //@ts-ignore
    function handleButton({target}){
        const key = target.getAttribute("data-key")
        
        const index = letters.findIndex(e => e.key == key)
        if(index == -1)
            return

        if(letters[index].used)
            return

        letters[index].used = true
    }

</script>

<svelte:window onkeydown={handleKeyboard}/>

<div>
    {#each letters as {key, used}}
        <button data-key={key} disabled={used} onclick={handleButton}>{key}</button>
    {/each}
</div>

<style lang="scss">
    div{
        display: flex;
        flex-wrap: wrap;
        max-width: 90vw;
        justify-content: center;
        align-items: flex-end;

        & > button{
            aspect-ratio: 1/1;
            display: block;

            width: clamp(30px, 5vw + 1rem, 75px);
        }
    }
</style>