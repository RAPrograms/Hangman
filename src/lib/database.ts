import { openDB, type IDBPDatabase } from 'idb';

class WordBank{
    #instance: Promise<IDBPDatabase>

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
}


const bank = new WordBank("Word-Bank", 1)

export const db_ready = bank.wait_for_open.bind(bank)