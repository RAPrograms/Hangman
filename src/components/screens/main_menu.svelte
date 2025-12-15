<script lang="ts">
    import TextIcon from "$icons/text.svg?raw" 
    import ListIcon from "$icons/list.svg?raw" 
    import DicesIcon from "$icons/dices.svg?raw" 
    import SettingsIcon from "$icons/settings.svg?raw" 
    import DownloadIcon from "$icons/download.svg?raw" 
</script>

<main>
    <header>
        <h1>Hangman</h1>
        <p>Choose your game mode</p>
    </header>

    <form>
        <h2>
            {@html TextIcon}
            Custom Word
        </h2>
        <label>
            <div>Custom Word</div>
            <input id="custom-word" placeholder="" name="value" type="text" required>
        </label>
        <button type="submit">Play</button>
    </form>

    <form>
        <h2>
            {@html ListIcon}
            Random Word from Category
        </h2>
        <label>
            <div>Custom Word</div>
            <select id="category" name="value" required>
                <option value="1">Category 1</option>
                <option value="2">Category 2</option>
                <option value="3">Category 3</option>
            </select>
        </label>
        <button type="submit">Play dasasd</button>
    </form>

    <button>
        {@html DicesIcon}
        <h2>Random</h2>
        <div>Play with a completly random word</div>
    </button>

    <button>
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
    main{
        text-align: left;
        width: 500px;
        gap: 20px;

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
            background-color: rgba(50, 77, 118, 0.404);
            border: 1px solid var(--border-colour);
            backdrop-filter: blur(8px);
            border-radius: 10px;
            padding: 20px;

            & > h2{
                font-weight: normal;
                font-size: large;
            }
        }

        & > form{
            width: 100%;
            gap: 15px;

            & > h2{
                align-items: center;
                gap: 5px;
            }

            &:has(input:invalid) > button[type=submit]{
                --background-strength: 60%;

                transition: background-color 400ms ease-in-out;
                cursor: default;
            }

            & > label, & > button[type=submit]{
                border: 1px solid var(--border-colour);
                border-radius: 10px;
            }

            & > label{
                background-color: rgba(16, 24, 40, 0.758);
                position: relative;
                padding-top: 1rem;
                display: block;

                & > div{
                    color: color-mix(in hsl shorter hue, var(--border-colour) 40%, grey);
                    padding: 2px 15px 0 15px;
                    transition: all 150ms;
                    pointer-events: none;
                    position: absolute;
                    font-size: .8rem;
                    top: 0px;
                }

                & > input, & > select{
                    font-size: 1.2rem;
                    padding: 7px 15px;
                    background: none;
                    border: none;
                    width: 100%;
                }

                & > input, & > select{
                    outline: none;
                }

                &:has(input:placeholder-shown:not(:is(:active, :focus))) > div{
                    transition: all 450ms;
                    top: calc(50% - 2px);
                    translate: 0 -50%;
                } 

                &:has(:is(input, select):focus){
                    outline: 1px solid red;
                }
            }

            & > button[type=submit]{
                background-color: color-mix(in hsl shorter hue, rgb(20, 71, 230) var(--background-strength, 100%), black);
                transition: background-color 200ms ease-in-out;
                cursor: pointer;
                color: white;
                padding: 10px;
                border: none;
            }
        }

        & > button{
            grid-template-columns: max-content 1fr; 
            grid-template-rows: 1fr 1fr; 
            grid-auto-columns: 1fr; 
            text-align: left;
            gap: 10px 20px; 
            display: grid; 
            grid-template-areas: 
                "Icon Title"
                "Icon Description"; 

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
                grid-area: Description;
            }
        }
    }
</style>