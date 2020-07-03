export class StorageManager {
    public static shared: StorageManager = new StorageManager()

    private static mappingsKey: string = "mappings"

    private constructor() {}

    public async getMappings(): Promise<{[key: string]: string}> {
        return browser.storage.local
            .get(StorageManager.mappingsKey)
            .then((res) => {
                const mappings = res[StorageManager.mappingsKey]

                return mappings === undefined ? {} : JSON.parse(mappings)
            })
    }
}
