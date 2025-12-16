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