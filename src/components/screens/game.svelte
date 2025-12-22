<script lang="ts">
    import Keyboard from "../keyboard.svelte";

    const { 
        word,
        category
    }:{
        word: string,
        category: string
    } = $props()
</script>

<div>{word} from {category}</div>

<Keyboard/>