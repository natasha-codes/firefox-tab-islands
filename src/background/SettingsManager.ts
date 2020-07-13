import { Constants } from "../Constants"
import { ContextualIdentityDetails } from "../ContextualIdentity"
import {
  IslandSettings,
  RouteSettings,
  StorageWrapper,
} from "../StorageWrapper"
import { Util } from "./Util"

export class SettingsManager {
  public static shared: SettingsManager = new SettingsManager()

  private _settings: Settings = {
    islands: {},
    routes: {},
  }

  private constructor() {}

  public async attach(): Promise<void> {
    this.loadSettingsFromStorage()

    browser.storage.onChanged.addListener((_, areaName) =>
      this.onSettingsChange(areaName),
    )
  }

  public getMappedCookieStoreForUrl(url: string): null | CookieStoreId {
    const firstMatchingMappingKey = Object.keys(
      this._settings.routes,
    ).find((urlFragment) => url.includes(urlFragment))

    if (!firstMatchingMappingKey) {
      return null
    }

    const islandForUrl = this._settings.routes[firstMatchingMappingKey]
    const cookieStoreId = this._settings.islands[islandForUrl]?.cookieStoreId

    if (!cookieStoreId) {
      console.error(`No cookie store id found for island: '${islandForUrl}'`)
      return null
    }

    return cookieStoreId
  }

  private async onSettingsChange(areaName: string): Promise<void> {
    if (areaName !== Constants.storageArea) {
      return
    }

    const oldSettings: Settings = Util.deepCopyJson(this._settings)

    console.log("onSettingsChange - old settings: ", oldSettings)

    await this.loadSettingsFromStorage()

    const newSettings: Settings = this._settings

    console.log("onSettingsChange - new settings: ", newSettings)

    // Remove CIs that are no longer associated with islands
    const oldIslandNames = new Set<string>(Object.keys(oldSettings.islands))
    const currentIslandNames = new Set<string>(Object.keys(newSettings.islands))

    // set difference: https://exploringjs.com/impatient-js/ch_sets.html#difference-a-b
    const orphanedIslandNames = new Set<string>(
      [...oldIslandNames].filter((name) => !currentIslandNames.has(name)),
    )

    console.log(
      "onSettingsChange - removing orphaned islands: ",
      orphanedIslandNames,
    )

    return Promise.all(
      Array.from(orphanedIslandNames).map((name) => {
        return browser.contextualIdentities.remove(
          oldSettings.islands[name].cookieStoreId,
        )
      }),
    ).then((_) => {})
  }

  /**
   * Load all settings from storage.
   */
  private async loadSettingsFromStorage(): Promise<void> {
    console.log("loadSettingsFromStorage")

    const storedSettings = await StorageWrapper.getStoredSettings()

    this._settings.islands = storedSettings.islands
    this._settings.routes = storedSettings.routes
    this._settings.cookieStores = await this.getOrCreateCookieStoresForIslands(
      storedSettings.islands,
    )
  }

  /**
   * Update island settings from storage.
   */
  private async getOrCreateCookieStoresForIslands(
    storedIslands: IslandSettings,
  ): Promise<{ [key: string]: CookieStoreId }> {
    const storedIslandEntries: [
      string,
      ContextualIdentityDetails,
    ][] = Object.entries(storedIslands)

    const cookieStoreEntries: Promise<
      [string, CookieStoreId]
    >[] = storedIslandEntries.map(([name, ciDetails]) =>
      this.getOrCreateCookieStoreForIsland(
        name,
        ciDetails,
      ).then((cookieStoreId) => [name, cookieStoreId]),
    )

    return Object.fromEntries(await Promise.all(cookieStoreEntries))
  }

  /**
   * Get the CookieStoreId of the ContextualIdentity for this island,
   * or create a CI with the given details if none exists.
   */
  private async getOrCreateCookieStoreForIsland(
    islandName: string,
    ciDetails: ContextualIdentityDetails,
  ): Promise<CookieStoreId> {
    const existingCIsForIsland = await browser.contextualIdentities.query({
      name: islandName,
    })

    if (existingCIsForIsland.length === 0) {
      return this.createContextualIdentityForIsland(islandName, ciDetails)
    } else if (existingCIsForIsland.length === 1) {
      return existingCIsForIsland[0].cookieStoreId
    } else {
      console.error("Multiple CIs found for island name: ", islandName)
      return existingCIsForIsland[0].cookieStoreId
    }
  }

  /**
   * Create a ContextualIdentity with the given details, for the given
   * island. The CI will have the same name as the island.
   */
  private async createContextualIdentityForIsland(
    islandName: string,
    ciDetails: ContextualIdentityDetails,
  ): Promise<CookieStoreId> {
    return browser.contextualIdentities
      .create({
        name: islandName,
        color: ciDetails.color,
        icon: ciDetails.icon,
      })
      .then((contextualIdentity) => contextualIdentity.cookieStoreId)
  }
}

export type CookieStoreId = string

interface Settings {
  islands: IslandSettings
  routes: RouteSettings
  cookieStores: { [key: string]: CookieStoreId } // keys == island names
}
