import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { writable } from 'svelte/store';

const db = await openDB("word-bank", 1, {
    upgrade: (db, oldVersion, newVersion, transaction, event) => {
        const words_store = db.createObjectStore('words', { keyPath: "value" });
        words_store.createIndex("category", "category")

        db.createObjectStore('categories', { keyPath: "name" });
    }
});

async function fetchFile(name: string, parse_lines: boolean = true): Promise<[string, null] | [null, any] | [Array<string>, null]> {
    try {
        const res = await fetch(`/words/${name}`)
        if(!res.ok || res.status >= 300 || 200 > res.status)
            throw Error(`Request not ok (${res.status})`)
 
        const text = await res.text()
        if(parse_lines)
            return [
                text.split("\n").map(val => val.trim()), 
                null
            ]

        return [text, null]
    } catch (error) {
        return [null, error]
    }
}

async function syncCategories(): Promise<Array<string>>{
    const [categories, error] = await fetchFile(".index")
    if(error != null){
        console.error(`Unable to sync categories due to ${error}`)
        return []
    }

    try {
        for(let i=0; i<categories!.length; i++){
            if(await db.get('categories', categories![i]) != undefined)
                continue
            
            await db.add('categories', {
                name: categories![i],
                local_only: false,
            });
        }
    } catch (error) {
        console.error(`Unable to sync categories to database due to ${error}`)
        return []
    }

    return categories as Array<string>
}


async function syncCategoryWords(filename: string){
    const [words, error] = await fetchFile(filename)
    if(error != null){
        console.error(`Unable to sync categories due to ${error}`)
        return
    }

    try {
        for(let i=0; i<words!.length; i++){
            if(await db.get('words', words![i]) != undefined)
                continue
            
            await db.add('words', {
                category: filename,
                value: words![i],
            });
        }
    } catch (error) {
        console.error(`Unable to sync "${filename}" words to database due to ${error}`)
        return 
    }
}

async function sync(){
    const categories = await syncCategories();
    
    const tasks = []
    for(let i=0; i<categories.length; i++){
        tasks.push(syncCategoryWords(categories[i]))
    }

    await Promise.all(tasks)
}

async function load_categories() {
    const categories = await db.getAll("categories")
    const output = []

    for(let i=0; i<categories.length; i++){
        const category = categories[i].name
        const count = await db.countFromIndex("words", "category", IDBKeyRange.only(category))
        if(count <= 0)
            continue

        output.push({
            name: category,
            count
        })
    }
    
    return writable(output)
}




await sync()
const categories = await load_categories()

export {
    categories
};