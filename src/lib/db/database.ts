import { openDB, type IDBPDatabase, type IDBPTransaction } from 'idb';
import { randomNumber } from '$lib/utils';

import WordCategory from '$db/categories';

class WordBank{
    #instance: Promise<IDBPDatabase>
    #categories: Record<string, WordCategory> | undefined

    constructor(name: string, version: number){
        this.#instance = this.#instance = new Promise<IDBPDatabase>(async resolve => {
            const db = await openDB(name, version, {
                upgrade: this.#upgrader
            });

            resolve(db)
        })
    }

    #upgrader(
        db: IDBPDatabase<unknown>,
        oldVersion: number,
        newVersion: number | null,
        transaction: IDBPTransaction<unknown, string[], "versionchange">,
        event: IDBVersionChangeEvent
    ){
        const words_store = db.createObjectStore("words", { autoIncrement: true })
        words_store.createIndex("category", "category")
        words_store.createIndex("hash", ["category", "content"])

        db.createObjectStore('categories', { keyPath: "name" });
    }

    wait_for_open(): Promise<void>{
        return new Promise(async resolve => {
            await this.#instance
            resolve()
        })
    }


    async getCategories(): Promise<Record<string, WordCategory>>{
        if(this.#categories != undefined)
            return this.#categories

        const db = await this.#instance
        const names: Array<{ name: string, local_only: boolean }> = await db.getAll("categories")

        const output: Record<string, WordCategory> = {}
    
        for(let i=0; i<names.length; i++){
            const category = names[i].name
            output[category] = await WordCategory.open(category, db)
        }

        return output
    }

    async newCategory(name: string){
        const categories = await this.getCategories()
        if(categories[name] != undefined)
            return categories[name]

        const category = await WordCategory.open(name, await this.#instance)

        categories[name] = category
        this.#categories = categories

        return category
    }

    /** Returns a random word from a random category */
    async getRandom(): Promise<[ string | undefined, string ]>{
        const categories = await this.getCategories()

        const keys = Object.keys(categories)
        const index = randomNumber(keys.length - 1);

        return [await categories[keys[index]].getRandom(), keys[index]]
    }

    async deleteCategory(name: string){
        const categories = await this.getCategories()
        const category = categories[name]
        if(category == undefined)
            return 

        await category.delete()
    }
}

export const bank = new WordBank("Word-Bank", 1)