<script lang="ts">
    import ChevronIcon from "$icons/chevron-right.svg?raw"
    import ExitIcon from "$icons/left-line-arrow.svg?raw"
    import CrossIcon from "$icons/cross.svg?raw"
    import AddIcon from "$icons/plus.svg?raw"

    import { type categoryDetails, db_ready, getCategories, getAllWords, removeWord } from "$lib/database";
    import { titleCase } from "../../lib/utils";
    import { onMount } from "svelte";

    let categories: Array<categoryDetails> = $state([])

    let category = $state("")

    onMount(async () => {
        categories = await getCategories()
    })

    async function remove_word(e: Event){
        const bnt = e.target as HTMLButtonElement
        (bnt.parentNode as HTMLElement).remove()

        const word = bnt.getAttribute("data-word")
        await removeWord(word)

        const update_index = categories.findIndex(({name}) => name == category)
        if(categories[update_index].size > 0)
            categories[update_index].size -= 1
    }
</script>

<div class="page">
    <header>
        <button type="button" aria-label="Exit Button">
            {@html ExitIcon}
        </button>
        <h1>Settings</h1>
    </header>

    <main>
        <section class="categories">
            <h2>Categories</h2>
            <div>
                <button class="primary-bnt">
                    {@html AddIcon}
                    Create
                </button>

                {#await db_ready()}
                    <span class="loading">Loading</span>
                {:then _}
                    {#each categories as {name, size}}
                        <label>
                            <span>
                                <div>{titleCase(name)}</div>
                                <div>({size})</div>
                            </span>
                            {@html ChevronIcon}
                            <input type="radio" bind:group={category} value={name}>
                        </label> 
                    {/each}
                {/await}
            </div>
        </section>
        
        <section class="details">
            {#if category != ""}
                <header>
                    <h2>{titleCase(category)} - Words</h2>
                    <button type="button">
                        {@html CrossIcon}
                        Delete
                    </button>
                </header>

                
                <div>
                    {#await getAllWords(category)}
                        {#each {length: 4} as _}
                            <div>
                                <div class="loading">Loading</div>
                            </div>
                        {/each}
                    {:then words} 
                        {#each words as word}
                            <div>
                                <span>{word}</span>
                                
                                <button type="button" data-word={word} onclick={remove_word}>
                                    {@html CrossIcon}
                                </button>
                            </div>
                        {/each}
                    {/await}
                </div>
                
            {:else}
                <div class="message">Select a category to view and manage words</div>
            {/if}
        </section>
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

            & > .details{
                flex-grow: 1;
                padding: 20px;

                & > header{
                    justify-content: space-between;
                    display: flex;

                    & > button{
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
                    place-items: center;
                    display: grid;
                }

                & > div{
                    flex-wrap: wrap;
                    gap: 20px;
                    
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

                        & > button{
                            place-items: center;
                            background: none;
                            display: grid;
                            border: none;

                            & > :global(svg){
                                pointer-events: none;
                            }
                        }
                    }
                }
            }
        }
    }
</style>