<div class="screen">
    <main></main>

    <div class="logo">
        <h1>Hangman</h1>
        <img src="/assets/logo.svg" alt="">
    </div>

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