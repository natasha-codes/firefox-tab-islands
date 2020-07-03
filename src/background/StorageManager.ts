export class StorageManager {
    public static shared: StorageManager = new StorageManager()

    private static mappingsKey: string = "mappings"

    private _mappings: {[key: string]: string}
    private constructor() {}

    public async attach(): Promise<void> {
        return browser.storage.local
            .get(StorageManager.mappingsKey)
            .then((res) => {
                const mappings = res[StorageManager.mappingsKey]

                this._mappings =
                    mappings === undefined ? {} : JSON.parse(mappings)
            })
    }

    public mappings(): {[key: string]: string} {
        return this._mappings
    }
}
