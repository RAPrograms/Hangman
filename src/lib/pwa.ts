import { writable } from 'svelte/store';

export const pwaInstaller = new Promise<any>(resolve => {
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); 
        resolve(event)
    });
})

export const pwaInstalled = (() => {
    const { set, subscribe } = writable(
        // Standard PWA check (Chrome, Edge, Android, modern Safari)
        window.matchMedia("(display-mode: standalone)").matches ||

        // iOS Safari legacy check
        // @ts-ignore
        window.navigator.standalone == true ||

        // Android Trusted Web Activity / WebAPK
        document.referrer.startsWith("android-app://")
    )

    window.addEventListener("appinstalled", () => {
        console.log("installed")
        set(true)
    })

    return { subscribe }
})()

export async function install(){
    const installer = await pwaInstaller
    if(installer == undefined)
        return
   
    console.log(installer)
    const result = await installer.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
}