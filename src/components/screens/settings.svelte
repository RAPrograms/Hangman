<script lang="ts">
    
    import ChevronIcon from "$icons/chevron-right.svg?raw"
    import ExitIcon from "$icons/left-line-arrow.svg?raw"
    import CrossIcon from "$icons/cross.svg?raw"
    import AddIcon from "$icons/plus.svg?raw"
    import Model from "../model.svelte";

    import CategoryWordsManager from "../category_words_manager.svelte";
    import WordCategory from "$db/categories";
    
    import { titleCase } from "../../lib/utils";
    import { bank } from "$db/database";

    let { gState = $bindable() } : { gState: globalState } = $props()
    let model: Model

    let categories: Record<string, {instance: WordCategory, size: number}> = $state({})
    let loading_categories = new Promise<void>(async resolve => {
        
        const results: Record<string, WordCategory> = await bank.getCategories()
        for (const instance of Object.values(results)) {
            categories[instance.name] = {
                instance,
                size: instance.size,
            }
        }
        
        resolve()
    })
    
    let selected_category = $state("")

    async function create_category() {
        const data = await model.prompt("new-category")
        if(data == undefined)
            return

        const name = data.get("value")

        const category_instance: WordCategory = await bank.newCategory(name)
        categories[category_instance.name] = {
            instance: category_instance,
            size: category_instance.size,
        }

        selected_category = category_instance.name
    }
</script>

{#snippet NewCategoryForm(handler: (e: Event) => void, cancel: () => void)}
    <header>
        <h1>Add new category</h1>
        <button type="button" class="icon-bnt" onclick={cancel}>{@html CrossIcon}</button>
    </header>
    <form onsubmit={handler}>
        <label class="field">
            <div>Category Name</div>
            <input id="custom-word" placeholder="" name="value" type="text" required>
        </label>
        <div class="actions">
            <button type="button" class="destructive-bnt" onclick={cancel}>Cancel</button>
            <button type="submit" class="primary-bnt">Save</button>
        </div>
    </form>
{/snippet}

<Model bind:this={model} pages={{"new-category": NewCategoryForm}}/>

<div class="page">
    <header>
        <button type="button" aria-label="Exit Button" onclick={() => gState.screen = "main-menu"}>
            {@html ExitIcon}
        </button>
        <h1>Settings</h1>
    </header>

    <main>
        <section class="categories">
            <h2>Categories</h2>
            <div>
                <button class="primary-bnt" onclick={create_category}>
                    {@html AddIcon}
                    Create
                </button>

                {#await loading_categories}
                    <span class="loading">Loading</span>
                {:then _}
                    {#each Object.values(categories) as {instance, size}}
                        <label>
                            <span>
                                <div>{titleCase(instance.name)}</div>
                                <div>({size})</div>
                            </span>
                            {@html ChevronIcon}
                            <input type="radio" bind:group={selected_category} value={instance.name}>
                        </label> 
                    {/each}
                {/await}
            </div>
        </section>

        {#if selected_category == ""}
            <div class="message">Select a category to view and manage words</div>
        {:else}
            <CategoryWordsManager bind:details={categories[selected_category]} onDelete={() => {
                delete categories[selected_category]
                selected_category = ""
            }}/>
        {/if}
    </main>
</div>

<style lang="scss">
    @use "../../styling/variables" as *;

    .primary-bnt{
        align-items: center;
        border-radius: 10px;
        padding: 7px 10px;
        font-weight: bold;
        display: flex;
        border: none;
        gap: 5px;
    }
    
    .page{
        flex-direction: column;
        height: 100vh;
        
        &, & > header{
            display: flex;
            width: 100%;
        }

        & > header{
            border-bottom: 1px solid color-mix(in hsl shorter hue, var(--faint-colour) 20%, transparent);
            background-color: rgb(44, 50, 59);
            align-items: center;
            padding: 20px;
            width: 100%;
            gap: 10px;
            
            & > h1{
                font-size: x-large;
            }

            & > button{
                color: var(--faint-colour);
                translate: 0 2px;
                background: none;
                border: none;
            }
        }

        & > main{
            overflow: hidden;
            display: flex;
            flex-grow: 1;

            & > *{
                flex-direction: column;
                display: flex;
                gap: 20px;
            }

            & > .categories{
                --background-colour: #1e2939;

                border-right: 1px solid var(--border-colour);
                background-color: var(--background-colour);
                backdrop-filter: blur(20px);
                padding: 20px;
                width: 300px;
                gap: 0;

                & > h2{
                    border-bottom: 2px solid color-mix(in hsl shorter hue, var(--faint-colour) 20%, transparent);
                    padding-bottom: 20px;
                }
                
                & > div{
                    flex-direction: column;
                    padding-top: 20px;
                    overflow-y: auto;
                    display: flex;
                    gap: 20px;

                    & > button.primary-bnt{
                        justify-content: center;
                    }


                    & > label{
                        @include UI_Card($background-opacity: var(--background-opacity, 100%));

                        transition: background-color 400ms ease-in-out,
                        border-color 400ms ease-in-out;
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        padding: 20px;
                        gap: 10px;

                        &:has(input:checked){
                            --background-opacity: 20%;

                            transition: background-color 200ms ease-in-out,
                                border-color 200ms ease-in-out;
                            border-color: var(--primary-colour);
                        }

                        & > span > :nth-child(2), & > :global(svg){
                            color: var(--faint-colour)
                        }
                        
                        &, & > span{
                            display: flex;
                        }

                        & > span{
                            gap: 5px;
                        }

                        & > input{
                            display: none;
                        }
                    }
                }
            }
        }
    }
</style>