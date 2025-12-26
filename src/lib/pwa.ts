import { writable } from 'svelte/store';

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
        set(true)
    })

    return { subscribe }
})()