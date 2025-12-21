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

    async addWords(value: Array<string> | string, local_only: boolean = true){
        if(typeof value == "string")
            value = [value]

        // Ensures to add category to categories store
        if((await this.#db.get("categories", this.#name)) == undefined)
            await this.#db.add("categories", { name: this.#name, local_only })

        const index = this.#db.transaction('words').store.index('hash');
        
        const tasks = []
        for (const word of value){
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

    get size(){
        return this.#size
    }
}