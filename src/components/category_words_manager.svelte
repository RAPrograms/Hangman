<script lang="ts">
    import LeftChevron from "$icons/chevron-left.svg?raw"
    import CrossIcon from "$icons/cross.svg?raw"
    import AddIcon from "$icons/plus.svg?raw"

    import Model from "./model.svelte";
    
    import type WordCategory from "$db/categories";
    import { titleCase } from "$lib/utils";
    import { bank } from "$db/database";

    let model: Model

    const {
        details = $bindable(),
        onDelete,
        onExit
    } : {
        details: {instance: WordCategory, size: number},
        onDelete: () => void,
        onExit: () => void
    } = $props()

    let words: Array<{ content: string; id: number; }> = $state([])
    let loading_words = $state()

    $effect(() => {
        loading_words = new Promise<void>(async resolve => {
            words = await details.instance.getAll()
            resolve()
        })
    })

    async function remove_word(e: Event){
        const id = Number((e.target as HTMLButtonElement)
            .getAttribute("data-id")!)
      
        await details.instance.removeById(id)

        details.size = details.instance.size

        const index = words.findIndex(val => val.id == id);
        words.splice(index, 1)
    }

    async function delete_category() {
        const data = await model.prompt("del-category")
        if(data == undefined)
            return
        
        await bank.deleteCategory(details.instance.name)
        words = []

        onDelete()
    }

    async function add_word(e: Event) {
        e.preventDefault()

        const input = (e.target as HTMLFormElement).querySelector("input")!
        const word = input.value.toLowerCase()

        const ids = await details.instance.addWords(word)
        details.size += 1

        words.push({content: word, id: ids[word]})
        input.value = ""
    }
</script>

{#snippet CategoryDeletionForm(handler: (e: Event) => void, cancel: () => void)}
    <header>
        <h1>Delete Category?</h1>
        <button type="button" class="icon-bnt" onclick={cancel}>{@html CrossIcon}</button>
    </header>
    <form onsubmit={handler}>
        <p>Are you sure you want to delete {details.instance.name}?</p>
        <p>This is permanent and can not be undone</p>
        <div class="actions">
            <input type="submit" value="Yes" class="destructive-bnt">
            <button type="button" class="primary-bnt" onclick={cancel}>No</button>
        </div>
    </form>
{/snippet}

<Model bind:this={model} pages={{"del-category": CategoryDeletionForm,}}/>

<section>
    <header>
        <button class="back" onclick={onExit}>
            {@html LeftChevron}
        </button>
        <h2>{titleCase(details.instance.name)} - Words</h2>
        <button class="delete" type="button" onclick={delete_category}>
            {@html CrossIcon}
            Delete
        </button>
    </header>

    <form onsubmit={add_word}>
        <label class="field">
            <div>New Word</div>
            <input placeholder="" name="value" type="text" required>
        </label>
        <button type="submit">
            {@html AddIcon}
            Add
        </button>
    </form>
    
    <div>
        {#await loading_words}
            {#each {length: 4} as _}
                <div>
                    <div class="loading">Loading</div>
                </div>
            {/each}
        {:then _} 
            {#each words as {content, id}}
                <div>
                    <span>{content}</span>
                    
                    <button type="button" class="icon-bnt" data-id={id} onclick={remove_word}>
                        {@html CrossIcon}
                    </button>
                </div>
            {/each}
        {/await}
    </div>
</section>

<style lang="scss">
    @use "../styling/variables" as *;

    $layout-breakpoint: 600px;

    section{
        flex-direction: column;
        max-height: 100vh;
        padding: 20px;
        display: flex;
        flex-grow: 1;
        gap: 20px;
        
        & > header{
            justify-content: space-between;
            display: flex;

            & > button.back{
                @media (width >= $layout-breakpoint) {
                    display: none;
                    visibility: none;
                }
            }

            & > button.delete{
                @include UI_Card(rgb(151, 3, 3), 60%);
            
                align-items: center;
                display: flex;
                gap: 10px;
            }
        }

        & > .loading{
            width: max-content;
        }

        &:has(.message:only-child){
            color: var(--faint-colour);
        }

        & > form{
            display: flex;
            gap: 10px;

            & > .field{
                border-radius: 10px;
                flex-grow: 1;
            }

            & > button[type=submit]{
                @include UI_Card(green, 60%);

                align-items: center;
                display: flex;
                gap: 5px;
            }
        }

        & > div{
            overflow-y: auto;
            flex-wrap: wrap;
            gap: 20px;

            @media (width <= $layout-breakpoint) {
                justify-content: center;
            }
            
            &, & > div{
                display: flex;
            }

            & > div{
                @include UI_Card();

                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                max-width: 400px;
                flex-grow: 1;
                width: 100%;

                & > button > :global(svg){
                    pointer-events: none;
                }
            }
        }
    }
</style>