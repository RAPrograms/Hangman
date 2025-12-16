<script lang="ts">
    import ExitIcon from "$icons/left-line-arrow.svg?raw"
</script>

<div class="page">
    <header>
        <button type="button" aria-label="Exit Button">
            {@html ExitIcon}
        </button>
        <h1>Settings</h1>
    </header>
</div>

<style lang="scss">
    .page{
        flex-direction: column;
        min-height: 100vh;
        padding: 20px;
        
        &, & > header{
            display: flex;
            width: 100%;
        }

        & > header{
            width: 100%;
            align-items: center;
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
    }
</style>