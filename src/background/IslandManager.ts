import {Constants} from "../Constants"

export type CookieStoreId = string

export class StorageManager {
    public static shared: StorageManager = new StorageManager()

    private _mappings: {[key: string]: string}
    private constructor() {}

    public async attach(): Promise<void> {
        const storedMappings = await browser.storage.local.get(
            Constants.mappingsStorageKey,
        )

        const mappings = storedMappings[Constants.mappingsStorageKey]

        this._mappings = mappings ?? {}
    }

    public mappings(): {[key: string]: string} {
        return this._mappings
    }

    public async getMappedCookieStoreForUrl(
        url: string,
    ): Promise<null | CookieStoreId> {
        return null
    }
}
