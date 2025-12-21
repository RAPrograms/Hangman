<script lang="ts">
    import TextIcon from "$icons/text.svg?raw" 
    import ListIcon from "$icons/list.svg?raw" 
    import DicesIcon from "$icons/dices.svg?raw" 
    import SettingsIcon from "$icons/settings.svg?raw" 
    import DownloadIcon from "$icons/download.svg?raw" 

    import type WordCategory from "$db/categories";
    import { titleCase } from "$lib/utils";
    import { bank } from "$db/database";

    let { gState = $bindable() } : { gState: globalState } = $props()

    const categories: Promise<Record<string, WordCategory>> = bank.getCategories()

    let selected_category = $state("")

    // Preselect first category
    categories.then(details => selected_category = Object.keys(details)[0] || "")

    function playCustomWord(e: Event){
        e.preventDefault()

        const word = new FormData(e.target as HTMLFormElement).get("value")
        console.log(word)
    }

    async function playCategoryWord(e: Event){
        e.preventDefault()

        const category = (await categories)[selected_category]
        const word = await category.getRandom(selected_category)
        console.log(word)
    }

    async function playRandomWord(){
        const [word, category] = await bank.getRandom()
        console.log(word, category)
    }
</script>

<main>
    <header>
        <h1>Hangman</h1>
        <p>Choose your game mode</p>
    </header>

    <form onsubmit={playCustomWord}>
        <h2>
            {@html TextIcon}
            Custom Word
        </h2>
        <label class="field">
            <div>Custom Word</div>
            <input id="custom-word" placeholder="" name="value" type="text" required>
        </label>
        <button class="primary-bnt" type="submit">Play</button>
    </form>

    <form onsubmit={playCategoryWord}>
        <h2>
            {@html ListIcon}
            Random Word from Category
        </h2>
        <label class="field">
            <div>Custom Word</div>
            {#await categories}
                <span class="loading">Loading</span>
            {:then categories} 
                <select id="category" bind:value={selected_category} required>
                    {#each Object.values(categories) as category}
                        {#if category.size >= 1}
                            <option value={category.name}>{titleCase(category.name)}</option>
                        {/if}
                    {/each}
                </select>
            {/await}
        </label>
        <button class="primary-bnt" type="submit" disabled={selected_category == ""}>Play {titleCase(selected_category)}</button>
    </form>

    <button onclick={playRandomWord}>
        {@html DicesIcon}
        <h2>Random</h2>
        <div>Play with a completly random word</div>
    </button>

    <button onclick={() => gState.screen = "settings"}>
        {@html SettingsIcon}
        <h2>Settings</h2>
        <div>Update and modify words</div>
    </button>

    <button>
        {@html DownloadIcon}
        <h2>Install Locally</h2>
        <div>Download and play offline</div>
    </button>
</main>

<style lang="scss">
    @use "../../styling/variables" as *;

    main{
        max-width: calc(1280px + 2rem);
        text-align: left;
        margin: 0 auto;
        padding: 2rem;
        width: 500px;
        gap: 20px;

        & > form:nth-of-type(1){ --accent-colour: rgb(194, 122, 255); }
        & > form:nth-of-type(2){ --accent-colour: rgb(81, 162, 255); }
        & > button:nth-of-type(1){ --accent-colour: rgb(6, 223, 114); }
        & > button:nth-of-type(2){ --accent-colour: rgb(253, 199, 0); }
        & > button:nth-of-type(3){ --accent-colour: rgb(251, 100, 182); }

        & > header{
            text-align: center;
        }

        &, & > form, & > form > h2{
            display: flex;
        }

        &, & > form{
            flex-direction: column;
        }

        & > form, & > button{
            @include UI_Card();

            padding: 20px;

            & > h2{
                font-weight: normal;
                font-size: large;
            }

            :global(svg){
                color: var(--accent-colour)
            }
        }

        & > form{
            width: 100%;
            gap: 15px;

            & > h2{
                align-items: center;
                gap: 5px;
            }

            &:has(input:invalid) > button[type=submit], button[type=submit]:disabled{
                --background-strength: 60%;

                transition: background-color 400ms ease-in-out;
                cursor: default;
            }

            & > label, & > button[type=submit]{
                border: 1px solid var(--border-colour);
                border-radius: 10px;
            }
        }

        & > button{
            grid-template-columns: max-content 1fr; 
            grid-template-rows: 1fr 1fr; 
            grid-auto-columns: 1fr; 
            text-align: left;
            gap: 5px 20px; 
            display: grid; 
            grid-template-areas: 
                "Icon Title"
                "Icon Description"; 

            &:hover, &:active, &:focus{
                border-color: var(--accent-colour);
                background-color: color-mix(in hsl shorter hue, var(--accent-colour) 10%, transparent);
            }

            & > :global(svg){
                aspect-ratio: 1/1;
                grid-area: Icon;
                height: 100%;
            }

            & > h2{
                grid-area: Title;
                font-size: large;
            }

            & > div{
                color: var(--faint-colour);
                grid-area: Description;
            }
        }

        & > button, & > form :is(input, select, label){
            cursor: pointer;
        }
    }
</style>