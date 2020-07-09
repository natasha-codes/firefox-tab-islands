import {Constants} from "../Constants"

export class SettingsManager {
  public static shared: SettingsManager = new SettingsManager()

  private _islands: {
    [key: string]: Omit<ContextualIdentityDetails, "name">
  } = {}

  private _routes: StringToStringMap = {}

  private _islandNameToCookieStoreIdRoutes: StringToStringMap = {}

  private constructor() {}

  public async attach(): Promise<void> {
    this.applySettings()

    browser.storage.onChanged.addListener(this.onSettingsChange)
  }

  private onSettingsChange = async (
    changes: {[key: string]: browser.storage.StorageChange},
    areaName: string,
  ) => {
    if (areaName !== Constants.storageArea) {
      return
    }

    console.log("changes:", changes)

    const islandsChanges = changes?.islands?.newValue
    if (islandsChanges) {
      await this.updateIslands()
    }

    const routesChanges = changes?.routes?.newValue
    if (routesChanges) {
      await this.updateRoutes()
    }
  }

  public getMappedCookieStoreForUrl(url: string): null | CookieStoreId {
    const routes = this._routes

    const firstMatchingMappingKey = Object.keys(routes).find(urlFragment =>
      url.includes(urlFragment),
    )

    if (!firstMatchingMappingKey) {
      return null
    }

    const islandName = routes[firstMatchingMappingKey]

    const cookieStoreId = this._islandNameToCookieStoreIdRoutes[islandName]

    if (!cookieStoreId) {
      console.error(`No cookie store id found for islandName: '${islandName}'`)
    }

    return cookieStoreId
  }

  private async applySettings() {
    await this.updateRoutes()

    await this.createContextualIdentitiesFromIslands()
  }

  private async updateRoutes() {
    console.log("about to updateRoutes")

    const storedRoutes = await browser.storage.local.get(
      Constants.routesStorageKey,
    )

    console.log("storedRoutes: ", storedRoutes)

    const routes = storedRoutes[Constants.routesStorageKey]

    this._routes = routes ?? {}
  }

  private async updateIslands() {
    console.log("about to updateRoutes")

    const storedIslands = await browser.storage.local.get(
      Constants.islandsStorageKey,
    )

    console.log("storedIslands: ", storedIslands)

    const islands = storedIslands[Constants.islandsStorageKey]

    this._routes = islands ?? {}
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
  private async createContextualIdentitiesFromIslands() {
    const storedIslands = await browser.storage.local.get(
      Constants.islandsStorageKey,
    )

    const islands = storedIslands[Constants.islandsStorageKey]

    this._islands = islands ?? {}

    Object.entries(this._islands).forEach(async ([name, {color, icon}]) => {
      const matchingContextualIdentities = await browser.contextualIdentities.query(
        {name},
      )

      if (!!matchingContextualIdentities.length) {
        const firstMatch = matchingContextualIdentities[0]

        this._islandNameToCookieStoreIdRoutes[name] = firstMatch.cookieStoreId
      } else {
        this.createContextualIdentity({color, icon, name})
      }
    })
  }

  // ref - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities/create
  private async createContextualIdentity({
    name,
    icon,
    color,
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
    islandsChanges: browser.storage.StorageChange,
  ) {
    const uniqueOldIslandNames = new Set<string>(
      Object.keys(islandsChanges.oldValue?.islands),
    )
    const uniqueNewIslandNames = new Set<string>(
      Object.keys(islandsChanges.newValue?.islands),
    )

    // difference between old islands and new islands
    // ref - https://exploringjs.com/impatient-js/ch_sets.html#difference-a-b
    const removedIslandNames = new Set<string>(
      [...uniqueOldIslandNames].filter(name => !uniqueNewIslandNames.has(name)),
    )

    removedIslandNames.forEach(name =>
      browser.contextualIdentities.remove(
        this._islandNameToCookieStoreIdRoutes[name],
      ),
    )
  }
}

export type CookieStoreId = string

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
