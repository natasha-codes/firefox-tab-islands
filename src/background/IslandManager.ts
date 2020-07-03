import {Constants} from "../Constants"

export type CookieStoreId = string

export class IslandManager {
    public static shared: IslandManager = new IslandManager()

    private _islandNameToCookieStoreIdRoutes: StringToStringMap = {}
    private _routes: StringToStringMap = {}

    private constructor() {}

    public async attach(): Promise<void> {
        this.updateRoutes()

        browser.storage.onChanged.addListener(this.onStorageEvent)
    }

    public getMappedCookieStoreForUrl(url: string): null | CookieStoreId {
        const routes = this._routes

        const firstMatchingMappingKey = Object.keys(
            routes,
        ).find((urlFragment) => url.includes(urlFragment))

        if (!firstMatchingMappingKey) {
            return null
        }

        const islandName = routes[firstMatchingMappingKey]

        const cookieStoreId = this._islandNameToCookieStoreIdRoutes[islandName]

        if (!cookieStoreId) {
            console.error(
                `No cookie store id found for islandName: '${islandName}'`,
            )
        }

        return cookieStoreId
    }

    private async updateRoutes() {
        const storedRoutes = await browser.storage.local.get(
            Constants.routesStorageKey,
        )

        const routes = storedRoutes[Constants.routesStorageKey]

        this._routes = routes ?? {}

        this.createContextualIdentitiesRoutes()
    }

    private onStorageEvent = async (
        changes: {[key: string]: browser.storage.StorageChange},
        areaName: string,
    ) => {
        if (areaName !== Constants.storageArea) {
            return
        }

        const mappingChanges = changes?.routes
        if (mappingChanges) {
            this.removeUnmappedContextualIdentities(mappingChanges)

            this.updateRoutes()
        }
    }

    /**
     * create a map from island names (e.g. * "the_goog") from user
     * routes to cookieStoreId (serves as a unique identifier for the
     * contextual identity)
     *
     * this function ensures that there exists a contextual identity for every
     * island name in the user's mapping file
     *
     * if there already exists an island with the associated name store that
     * mapping, else create a new one
     */
    private createContextualIdentitiesRoutes() {
        const uniqueIslandNames = new Set(Object.values(this._routes))

        uniqueIslandNames.forEach(async (name) => {
            const matchingContextualIdentities = await browser.contextualIdentities.query(
                {name},
            )

            if (!!matchingContextualIdentities.length) {
                const firstMatch = matchingContextualIdentities[0]

                this._islandNameToCookieStoreIdRoutes[name] =
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

        this._islandNameToCookieStoreIdRoutes[name] =
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

        // difference between old routes and new routes
        // ref - https://exploringjs.com/impatient-js/ch_sets.html#difference-a-b
        const removedIslandNames = new Set<string>(
            [...uniqueOldIslandNames].filter(
                (name) => !uniqueNewIslandNames.has(name),
            ),
        )

        removedIslandNames.forEach((name) =>
            browser.contextualIdentities.remove(
                this._islandNameToCookieStoreIdRoutes[name],
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
