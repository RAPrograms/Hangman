import { base64ToBuffer, bufferToBase64 } from "./utils";

const secret = import.meta.env.VITE_CRYPTOGRAPHIC_SECRET || "DEVSECRET"

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function loadKey( 
    salt: Uint8Array<ArrayBuffer>
){
    const material = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        material,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

export async function encrypt(text: string){
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await loadKey(salt)

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(text)
    );

    // Salt . IV . Ciphertext
    return `${bufferToBase64(salt)}.${bufferToBase64(iv)}.${bufferToBase64(encrypted)}`
}

export async function encryptObject(data: Record<string, any>) {
    const text = JSON.stringify(data)
    return await encrypt(text)
}

export async function decrypt(datastring: string) {
    let data = datastring.split(".")
    
    const salt = base64ToBuffer(data[0]);
    const iv = base64ToBuffer(data[1]);
    const ciphertext = base64ToBuffer(data[2]);

    const key = await loadKey(salt);

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
    );

    return decoder.decode(decrypted);
}

export async function decryptObject(datastring: string) {
    const text = await decrypt(datastring)
    return JSON.parse(text)
}