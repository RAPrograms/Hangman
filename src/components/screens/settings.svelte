<script lang="ts">
    import ChevronIcon from "$icons/chevron-right.svg?raw"
    import ExitIcon from "$icons/left-line-arrow.svg?raw"
    import CrossIcon from "$icons/cross.svg?raw"
    import AddIcon from "$icons/plus.svg?raw"

    import { type categoryDetails, db_ready, getCategories } from "$lib/database";
    import { titleCase } from "../../lib/utils";
    import { onMount } from "svelte";

    let categories: Array<categoryDetails> = $state([])

    let category = $state("")

    onMount(async () => {
        categories = await getCategories()
    })
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
                    {#each categories as {name}}
                        <label>
                            <span>
                                <div>{titleCase(name)}</div>
                                <div>(45)</div>
                            </span>
                            {@html ChevronIcon}
                            <input type="radio" bind:group={category} value={name}>
                        </label> 
                    {/each}
                {/await}
            </div>
        </section>
        
        <section class="details">
            <h2>Details</h2>
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

                background-color: var(--background-colour);
                backdrop-filter: blur(20px);
                padding: 20px;
                width: 300px;
                gap: 0;

                & > h2{
                    padding-bottom: 20px;
                    border-bottom: 2px solid color-mix(in hsl shorter hue, var(--faint-colour) 20%, transparent);
                }
                

                & > div{
                    flex-direction: column;
                    padding-top: 20px;
                    overflow-y: auto;
                    display: flex;
                    gap: 20px;


                    & > label{
                        @include UI_Card(var(--background-opacity, 100%));

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
            }
        }
    }
</style>