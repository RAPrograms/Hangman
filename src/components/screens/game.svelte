<script lang="ts">
    import Keyboard from "../keyboard.svelte";

    const { 
        word,
        category
    }:{
        word: string,
        category: string
    } = $props()

    function validateLetter(letter: string): boolean{
        return word.toLowerCase().includes(letter.toLowerCase())
    }
</script>

<div>{word} from {category}</div>

<Keyboard validator={validateLetter}/>