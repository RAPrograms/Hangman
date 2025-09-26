<script lang="ts">
    import TextSVG from "../assets/text_logo.svg?raw"
    import RandomSVG from "../assets/random_logo.svg?raw"
</script>

<div class="screen">
    <div class="logo">
        <h1>Hangman</h1>
        <img src="/assets/logo.svg" alt="">
    </div>

    <main>
        <h2>Game Modes</h2>
        <button type="button" class="custom">
            {@html TextSVG}
            <div>Custom Word</div>
        </button>
        <button type="button" class="category">
            {@html RandomSVG}
            <div>Category Random</div>
        </button>
        <button type="button" class="random">
            {@html RandomSVG}
            <div>Random</div>
        </button>
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
            background: color-mix(in srgb, var(--background-colour), black 30%);
            grid-area: Modes;
            padding: 25px;
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


            & > button{
                transition: all 300ms ease-in-out;
                border: 1px solid rgb(79, 79, 79);
                border-radius: 10px;
                font-weight: bolder;
                align-items: center;
                padding: 10px 20px;
                font-size: x-large;
                background-color: color-mix(in srgb, var(--background-colour), white 3%);
                text-align: left;
                cursor: pointer;
                display: flex;
                height: 64px;
                gap: 30px;

                &:hover{
                    scale: 1.03;
                    background-color: color-mix(in srgb, var(--background-colour), white 5%);
                }

                & > :global(svg){
                    max-height: 20px;
                    height: 100%;
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