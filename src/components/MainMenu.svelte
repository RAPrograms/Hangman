<div class="screen">
    <main>
        <h2>Game Modes</h2>
        <button type="button" class="custom">Custom Word</button>
        <button type="button" class="category">Category Random</button>
        <button type="button" class="random">Random</button>
        <br>
        <button type="button" class="word-bank">Word Bank</button>
        <button type="button" class="settings">Settings</button>
    </main>

    <h1>Hangman</h1>

    <footer>Made by
        <a href="https://github.com/RAPrograms">RAPrograms</a>
    </footer>
</div>

<style lang="scss">
    .screen{


        @media (width > 0px) {
            display: grid; 
            grid-auto-columns: 1fr; 
            grid-template-columns: 1fr 1fr; 
            grid-template-rows: 1fr min-content; 
            gap: 0px 0px; 
            grid-template-areas: 
                "Modes Logo"
                "Modes Credit"; 
        }

        & > main{
            grid-area: Modes;
            max-width: 380px;
            display: flex;
            flex-direction: column;
            padding: 20px;
            justify-content: center;
            gap: 20px;

            border-right: 1px solid color-mix(in oklab, grey 20%, transparent);

            & > :first-child::after{
                content: "";
                height: 5px;
                width: 20%;
                background-color: white;
                display: block;
                border-radius: 20px;
            }

            & > button{
                transition: scale 400ms ease-out;
                border-radius: 10px;
                cursor: pointer;
                height: 64px;

                &:hover{
                    transition: scale 250ms ease-out;
                    scale: 1.03;
                }
            }
        }
    }
</style>