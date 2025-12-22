<script lang="ts">
    const { 
        word,
        category
    }:{
        word: string,
        category: string
    } = $props()
</script>

<div>{word} from {category}</div>