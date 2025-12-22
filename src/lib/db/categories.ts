import type { IDBPDatabase } from "idb"

import { randomNumber, databaseTasks } from "$lib/utils"

export default class WordCategory{
    #name: string
    #db: IDBPDatabase
    #size: number

    private constructor(name: string, size: number, db: IDBPDatabase){
        this.#name = name
        this.#db = db
        this.#size = size
    }

    static async open(name: string, db: IDBPDatabase){
        name = name.toLowerCase()

        const size = await db.countFromIndex(
            "words",
            "category",
            IDBKeyRange.only(name)
        )

        return new this(name, size, db)
    }

    async addWords(value: Array<string> | string){
        if(typeof value == "string")
            value = [value]

        // Ensures to add category to categories store
        if((await this.#db.get("categories", this.#name)) == undefined)
            await this.#db.add("categories", { name: this.#name })

        const index = this.#db.transaction('words').store.index('hash');
        
        const tasks = []
        const ids: Record<string, number> = {}
        for (let word of value){
            word = word.toLowerCase()

            tasks.push(new Promise<boolean>(async (resolve) => {
                // Presence check to prevent duplicates
                if(await index.get([this.#name, word]))
                    return resolve(false)

                try {
                    const id = await this.#db.add("words", { category: this.#name, content: word })
                    ids[word] = id as number
                } catch (error) {
                    return resolve(false)
                }
                
                return resolve(true)
            }))
        }

        this.#size += await databaseTasks(tasks)
        return ids
    }

    async removeById(ids: Array<number> | number){
        if(typeof ids == "number")
            ids = [ids]

        const tasks = []

        for (const id of ids) {
            tasks.push(new Promise<boolean>(async resolve => {
                try {
                    console.log(await this.#db.delete("words", Number(id)))
                } catch (error) {
                    console.error(error)
                    return resolve(false)
                }

                resolve(true)
            }))
        }

        this.#size -= await databaseTasks(tasks)

        if(this.#size > 0)
            return

        await this.#db.delete("categories", this.#name)
    }

    async removeWords(value: Array<string> | string){
        if(typeof value == "string")
            value = [value]

        // Creates a hashmap of all lowercase words to be removed
        const map = new Set(value.map(val => val.toLowerCase()))

        const tasks = []

        for await (const cursor of this.#reader()) {
            tasks.push(new Promise<boolean>(async resolve => {
                if(!map.has(cursor.value.content))
                    return resolve(false)

                try {
                    await this.#db.delete("words", cursor.primaryKey)
                } catch (error) {
                    return resolve(false)
                }

                resolve(true)
            }))
        }

        this.#size -= await databaseTasks(tasks)
        if(this.#size > 0)
            return

        await this.#db.delete("categories", this.#name)
    }

    /** Deletes all words in the category */
    async delete(){
        const tasks = []

        for await (const cursor of this.#reader()) {
            tasks.push(this.#db.delete("words", cursor.primaryKey))
        }

        await Promise.all(tasks)

        this.#size = 0
        await this.#db.delete("categories", this.#name)
    }

    /** 
     * Returns a random word from the category 
     * 
     * @returns a string if the size is bigger then 0
     */
    async getRandom(): Promise<string | undefined>{
        if(this.#size <= 0)
            return

        const index = randomNumber(this.#size - 1);

        let cursor = await this.#getIndex().openCursor(this.#name)
        if(index > 0)
            await cursor?.advance(index)

        return cursor!.value.content!
    }

    async getAll(){
        const output: Array<{content: string, id: number}> = []

        for await (const cursor of this.#reader()) {
            const obj = cursor.value
            delete obj["category"]
            obj["id"] = cursor.primaryKey
            output.push(obj)
        }

        return output
    }

    get size(){ return this.#size }
    get name(){ return this.#name }

    #getIndex(){
        return this.#db.transaction('words').store.index('category')
    }

    async* #reader(){
        for await (const cursor of this.#getIndex().iterate(this.#name)) {
            yield cursor
        }
    }
}