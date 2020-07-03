import {Constants} from "../Constants"

export type CookieStoreId = string

export class IslandManager {
    public static shared: IslandManager = new IslandManager()

    private _islandNameToCookieStoreIdMappings: StringToStringMap = {}
    private _mappings: StringToStringMap = {}

    private constructor() {}

    public async attach(): Promise<void> {
        this.updateMappings()

        browser.storage.onChanged.addListener(this.onStorageEvent)
    }

    public getMappedCookieStoreForUrl(url: string): null | CookieStoreId {
        const mappings = this._mappings

        const firstMatchingMappingKey = Object.keys(
            mappings,
        ).find((urlFragment) => url.includes(urlFragment))

        if (!firstMatchingMappingKey) {
            return null
        }

        const islandName = mappings[firstMatchingMappingKey]

        const cookieStoreId = this._islandNameToCookieStoreIdMappings[
            islandName
        ]

        if (!cookieStoreId) {
            console.error(
                `No cookie store id found for islandName: '${islandName}'`,
            )
        }

        return cookieStoreId
    }

    private async updateMappings() {
        const storedMappings = await browser.storage.local.get(
            Constants.mappingsStorageKey,
        )

        const mappings = storedMappings[Constants.mappingsStorageKey]

        this._mappings = mappings ?? {}

        this.createContextualIdentitiesMappings()
    }

    private onStorageEvent = async (
        changes: {[key: string]: browser.storage.StorageChange},
        areaName: string,
    ) => {
        if (areaName !== Constants.storageArea) {
            return
        }

        const mappingChanges = changes?.mappings
        if (mappingChanges) {
            this.removeUnmappedContextualIdentities(mappingChanges)

            this.updateMappings()
        }
    }

    /**
     * create a map of contextual identity names from user mappings (e.g.
     * "the_goog") to cookieStoreId (serves as a unique identifier for the
     * contextual identity)
     *
     * this function ensures that there exists a contextual identity for every
     * island name in the user's mapping file
     *
     * if there already exists an island with the associated name store that
     * mapping, else create a new one
     */
    private createContextualIdentitiesMappings() {
        const uniqueIslandNames = new Set(Object.values(this._mappings))

        uniqueIslandNames.forEach(async (name) => {
            const matchingContextualIdentities = await browser.contextualIdentities.query(
                {name},
            )

            if (!!matchingContextualIdentities.length) {
                const firstMatch = matchingContextualIdentities[0]

                this._islandNameToCookieStoreIdMappings[name] =
                    firstMatch.cookieStoreId
            } else {
                this.createContextualIdentity({name})
            }
        })
    }

    // ref - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities/create
    private async createContextualIdentity({
        name,
        icon = "fingerprint",
        color = "turquoise",
    }: ContextualIdentityDetails) {
        const contextualIdentity = await browser.contextualIdentities.create({
            color,
            icon,
            name,
        })

        this._islandNameToCookieStoreIdMappings[name] =
            contextualIdentity.cookieStoreId
    }

    // remove no longer mapped islands (contextual identities)
    private async removeUnmappedContextualIdentities(
        mappingChanges: browser.storage.StorageChange,
    ) {
        const uniqueOldIslandNames = new Set<string>(
            Object.values(mappingChanges.oldValue),
        )
        const uniqueNewIslandNames = new Set<string>(
            Object.values(mappingChanges.newValue),
        )

        // difference between old mappings and new mappings
        // ref - https://exploringjs.com/impatient-js/ch_sets.html#difference-a-b
        const removedIslandNames = new Set<string>(
            [...uniqueOldIslandNames].filter(
                (name) => !uniqueNewIslandNames.has(name),
            ),
        )

        removedIslandNames.forEach((name) =>
            browser.contextualIdentities.remove(
                this._islandNameToCookieStoreIdMappings[name],
            ),
        )
    }
}

type StringToStringMap = {[key: string]: string}

// ref - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities/create
interface ContextualIdentityDetails {
    color?:
        | "blue"
        | "turquoise"
        | "green"
        | "yellow"
        | "orange"
        | "red"
        | "pink"
        | "purple"
        | "toolbar"
    icon?:
        | "fingerprint"
        | "briefcase"
        | "dollar"
        | "cart"
        | "circle"
        | "gift"
        | "vacation"
        | "food"
        | "fruit"
        | "pet"
        | "tree"
        | "chill"
        | "fence"
    name: string
}
