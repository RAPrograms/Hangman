<div class="screen">
    <main></main>
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

        & > main{
            background: var(--background-colour);
            grid-area: Modes;
        }
    }
</style>