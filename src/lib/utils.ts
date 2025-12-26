export function titleCase(content: string){
    content = content.trim()

    return content.split(" ").map(word => {
        if(word == "")
            return word

        return word[0].toUpperCase() + word.substring(1)
    }).join(" ")
}

export function randomNumber(end: number, start: number = 0){
    const number = Math.random() * (end - start + 1)
    return Math.floor(number) + start;
}

/** Waits and returns total amount of changes */
export async function databaseTasks(tasks: Array<Promise<boolean>>): Promise<number>{
    const results = await Promise.all(tasks)
    return results.reduce((changes, res) => changes + Number(res), 0)
}

export async function fetchFile(uri: string) {
    try {
        const res = await fetch(uri)
        if(!res.ok)
            throw new Error("Request not OK")

        if(res.status < 200 || 299 <= res.status)
            throw new Error("Non 4xx status code")

        const content = await res.text()
        return [content.split("\n"), null]

    } catch (error) {
        return [null, error]
    }
}

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array<ArrayBuffer>): string{
    const array = new Uint8Array(buffer)
    const string = String.fromCharCode(...array)
    return btoa(string);
}

export function base64ToBuffer(base64: string): Uint8Array<ArrayBuffer>{
    return Uint8Array.from(
        atob(base64), 
        c => c.charCodeAt(0)
    );
}