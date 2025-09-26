<div class="screen">
    <div class="logo">
        <h1>Hangman</h1>
        <img src="/assets/logo.svg" alt="">
    </div>

    <main>
        <h2>Game Modes</h2>
        <button type="button" class="custom">Custom Word</button>
        <button type="button" class="category">Category Random</button>
        <button type="button" class="random">Random</button>
        <br>
        <button type="button" class="word-bank">Word Bank</button>
        <button type="button" class="settings">Settings</button>
    </main>

    <footer>
        <a href="https://github.com/RAPrograms/Hangman">RAPrograms</a>
    </footer>
</div>

<style lang="scss">
    
    .screen{
        $sidebar-width: 380px;

        @media (width >= ($sidebar-width * 2)) {  
            grid-template-columns: $sidebar-width 1fr; 
            grid-template-rows: 1fr min-content; 
            grid-auto-columns: 1fr; 
            position: relative;
            isolation: isolate;
            display: grid; 
            gap: 0px 0px; 
            grid-template-areas: 
                "Modes Logo"
                "Modes Credit"; 


            &::before{
                background-image: url("/assets/background.jpeg");
                background-repeat: no-repeat;
                background-position: bottom;
                filter: brightness(30%);
                background-size: cover;
                position: absolute;
                height: 100%;
                width: 100%;
                z-index: -1;
                content: "";
            }
        }

        & > main, & > .logo{
            justify-content: center;        
            flex-direction: column;
            display: flex;
        }

        & > main{
            background: var(--background-colour);
            grid-area: Modes;
            padding: 10px;
            gap: 20px;

            @media (width >= ($sidebar-width * 2)){
                border-right: 1px solid rgba(128, 128, 128, 0.505);
            }

            & > :first-child{
                @media (width >= ($sidebar-width * 2)){
                    &::after{
                        background-color: white;
                        border-radius: 20px;
                        margin-bottom: 10px;
                        display: block;
                        content: "";
                        height: 5px;
                        width: 20%;
                    }
                }

                @media (width < ($sidebar-width * 2)){
                    visibility: none;
                    display: none;
                }
            }
        }

        & > .logo{
            align-items: center;
            grid-area: Logo;

            & > h1{
                text-transform: uppercase;
                letter-spacing: 2%;

                @media (width >= ($sidebar-width * 2)){
                    font-size: min(8vw, 100px);
                }
            }

            & > img{
                @media (width < ($sidebar-width * 2)) or (height < 600px){
                    visibility: none;
                    display: none;
                }

                width: 320px;
            }
        }

        & > footer{
            text-align: center;
            font-weight: bold;
            grid-area: Credit;
            padding: 10px 0;
            
            & > a{
                color: white;
            }
        }
    }
</style>