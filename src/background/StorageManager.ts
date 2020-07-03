export type CookieStoreId = string

export class StorageManager {
    public static shared: StorageManager = new StorageManager()

    private static mappingsKey: string = "mappings"

    private _mappings: {[key: string]: string}
    private constructor() {}

    public async attach(): Promise<void> {
        const storedMappings = await browser.storage.local.get(
            StorageManager.mappingsKey,
        )

        const mappings = storedMappings[StorageManager.mappingsKey]

        this._mappings = mappings === undefined ? {} : JSON.parse(mappings)
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
