import { openDB, type IDBPDatabase } from 'idb';

export type categoryDetails = { name: string, size: number }

class WordBank{
    #instance: Promise<IDBPDatabase>
    #categories: Array<{name: string, size: number}> | undefined

    constructor(name: string, version: number){
        this.#instance = this.#instance = new Promise<IDBPDatabase>(async resolve => {
            const db = await openDB(name, version, {
                upgrade: (db, oldVersion, newVersion, transaction, event) => {
                    const words_store = db.createObjectStore('words', { keyPath: "value" });
                    words_store.createIndex("category", "category")

                    db.createObjectStore('categories', { keyPath: "name" });
                }
            });

            resolve(db)
        })
    }

    wait_for_open(): Promise<void>{
        return new Promise(async resolve => {
            await this.#instance
            resolve()
        })
    }

    async loadCategory(name: string): Promise<categoryDetails> {
        const db = await this.#instance
        
        const size = await db.countFromIndex(
            "words",
            "category",
            IDBKeyRange.only(name.toLowerCase())
        )

        return { name, size }
    }

    async getCategories(): Promise<Array<categoryDetails>>{
        if(this.#categories != undefined)
            return this.#categories

        const db = await this.#instance
        const names: Array<{ name: string, local_only: boolean }> = await db.getAll("categories")

        const details: Array<Promise<categoryDetails>> = []
    
        for(let i=0; i<names.length; i++){
            const category = names[i].name
            details.push(this.loadCategory(category))
        }

        const result = await Promise.all(details)
        
        this.#categories = result
        return result
    }
}


const bank = new WordBank("Word-Bank", 1)

export const db_ready = bank.wait_for_open.bind(bank)
export const getCategories = bank.getCategories.bind(bank)