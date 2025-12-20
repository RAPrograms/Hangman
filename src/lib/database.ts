import { openDB, type IDBPCursorWithValue, type IDBPDatabase } from 'idb';
import { randomNumber } from '$lib/utils';

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

    async getRandomWord(category: string | undefined = undefined){
        const categories = await this.getCategories()
        const db = await this.#instance

        if(category == undefined){
            const category_index = randomNumber(categories.length - 1)
            category = categories[category_index].name
        }else
            category = category?.toLowerCase()

        const wordSize = categories.find(val => val.name == category)?.size
        if(wordSize == undefined)
            return console.error(`Category "${category}" not found`)

        if(wordSize <= 0)
            return console.error("No words to load")
        
        const index = randomNumber(wordSize - 1);

        let cursor = await db.transaction('words').store.index("category").openCursor(category)
        if(index > 0)
            await cursor?.advance(index)

        return [cursor?.value.value, cursor?.value.category]
    }

    async getAllWords(category: string){
        const db = await this.#instance

        const index = db.transaction('words').store.index("category");
        const output = []

        for await (const cursor of index.iterate(category)) {
            output.push(cursor.value.value)
        }

        return output
    }

    async removeWord(value: string){
        const db = await this.#instance
        await db.delete("words", value)
    }

    async newCategory(name: string, local_only: boolean){
        const db = await this.#instance
        await db.put("categories", { name: name.toLowerCase(), local_only })
    }

    async deleteCategory(name: string){
        const db = await this.#instance

        const index = db.transaction('words').store.index("category");

        const tasks = []
        for await (const cursor of index.iterate(name.toLowerCase())) {
            tasks.push(db.delete("words", cursor.value.value))
        }

        await Promise.all(tasks)
        await db.delete("categories", name)
    }

    async addWords(category: string, words: Array<string> | string, local_only: boolean){
        category = category.toLowerCase()

        if(typeof words == "string")
            words = [words]

        const categories = await this.getCategories()
        const db = await this.#instance

        if((await db.get("categories", category)) == undefined)
            await db.put("categories", { name: category, local_only })
        

        const adding_tasks = []
        for (const word of words){
            adding_tasks.push(db.put("words", { category: category, value: word }))
        }

        await Promise.all(adding_tasks)

        // Updates the categories sizes stored in memory
        const category_index = categories.findIndex(val => val.name == category)

        if(category_index != -1) // Updating size
            categories[category_index].size += 1
        else // Add new category
            categories.push({ name: category, size: 1 })

        this.#categories = categories
    }
}

export const bank = new WordBank("Word-Bank", 1)