export function titleCase(content: string){
    content = content.trim()

    return content.split(" ").map(word => {
        if(word == "")
            return word

        return word[0].toUpperCase() + word.substring(1)
    })
}