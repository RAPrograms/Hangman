export function titleCase(content: string){
    content = content.trim()

    return content.split(" ").map(word => {
        if(word == "")
            return word

        return word[0].toUpperCase() + word.substring(1)
    })
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