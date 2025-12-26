<script lang="ts">
    import type { Snippet } from "svelte";

    const { pages }:{ pages: Record<string, (handler: (e: Event) => void, close: () => void) => ReturnType<Snippet>> } = $props()
    let dialog: HTMLDialogElement

    let resolver: (value: FormData | PromiseLike<FormData | undefined> | undefined) => void
    let selected: string = $state("")
    
    export function prompt(page: string){
        if(pages[page] == undefined)
            throw new Error("Page not found to display model of")

        selected = page
        dialog.showModal()

        return new Promise<FormData | undefined>(resolve => {
            resolver = resolve
        })
    }

    function handle_submission(e: Event){
        //@ts-ignore
        e.preventDefault()

        const form = e.target! as HTMLFormElement
        const data = new FormData(form)

        dialog.close()
        resolver(data)
        selected = ""
    }

    function close(){
        dialog.close()
        resolver(undefined)
        selected = ""
    }
</script>

<dialog bind:this={dialog}>
    {#if selected != ""}
        {@render pages[selected](handle_submission, close) }
    {/if}
</dialog>

<style lang="scss">
    @use "../styling/variables" as *;

    dialog{
        @include UI_Card($background-opacity: 50%);

        animation: zoomIn 100ms ease-in 1;
        min-width: min(400px, 100%);
        min-height: 100px;
        margin: auto;
        
        &:not([open]){
            visibility: none;
            display: none;
        }

        &, & > :global(form), & :global(.buttons){
            flex-direction: column;
            display: flex;
            gap: 20px;
        }

        &::backdrop{
            background-color: rgba(0, 0, 0, 0.5);
        }

        & > :global(header){
            border-bottom: 1px solid var(--faint-colour);
            justify-content: space-between;
            display: flex;
            padding: 10px;

            & > :global(:is(h1, h2, h3, h4, h5, h6)){
                font-size: large;
            }

            &:has(:global(button)) {
                text-align: left;
            }

            & > :global(:not(button)){
                flex-grow: 1;
            }
        }

        & :global(label.field){
            border-radius: 10px;
        }

        & :global(.actions){
            justify-content: right;
            display: flex;
            gap: 10px;

            & > :global(*){
                border-radius: 5px;
            }
        }

        & :global(.buttons) > :global(button){
            @include UI_Card(var(--accent-colour), 20%);

            cursor: pointer;
            padding: 20px;
            width: 100%;
        }
    }


    @keyframes zoomIn{
        from { transform: scale(.5); }
        to { transform: scale(1); }
    }
</style>