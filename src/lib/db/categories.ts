import type { IDBPDatabase } from "idb"

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

            tasks.push(new Promise<void>(async (resolve) => {
                // Presence check to prevent duplicates
                if(await index.get([this.#name, word]))
                    return resolve()
                
                this.#db.put("words", { category: this.#name, content: word })
                return resolve()

            }))
        }

        await Promise.all(tasks)

        this.#size += value.length
    }

    async removeWords(value: Array<string> | string){
        if(typeof value == "string")
            value = [value]

        // Creates a hashmap of all lowercase words to be removed
        const map = new Set(value.map(val => val.toLowerCase()))

        const tasks = []

        for await (const cursor of this.#reader()) {
            if(!map.has(cursor.value.content))
                continue

            tasks.push(this.#db.delete("words", cursor.primaryKey))
        }

        await Promise.all(tasks)

        this.#size -= value.length
        if(this.#size > 0)
            return

        await this.#db.delete("categories", this.#name)
    }

    get size(){
        return this.#size
    }

    async* #reader(){
        const index = this.#db.transaction('words').store.index('category');
        for await (const cursor of index.iterate(this.#name)) {
            yield cursor
        }
    }
}