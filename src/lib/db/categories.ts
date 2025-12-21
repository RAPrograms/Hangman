import type { IDBPDatabase } from "idb"
import { randomNumber } from "$lib/utils"
import { databaseTasks } from "../utils"

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
        for (let word of value){
            word = word.toLowerCase()

            tasks.push(new Promise<boolean>(async (resolve) => {
                // Presence check to prevent duplicates
                if(await index.get([this.#name, word]))
                    return resolve(false)

                try {
                    this.#db.put("words", { category: this.#name, content: word })
                } catch (error) {
                    return resolve(false)
                }
                
                return resolve(true)
            }))
        }

        this.#size += await databaseTasks(tasks)
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

    get size(){
        return this.#size
    }

    #getIndex(){
        return this.#db.transaction('words').store.index('category')
    }

    async* #reader(){
        for await (const cursor of this.#getIndex().iterate(this.#name)) {
            yield cursor
        }
    }
}