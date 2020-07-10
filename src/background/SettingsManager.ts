import { Constants } from "../Constants"
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

    return Promise.all([
      this.loadIslandSettingsFromStorage(),
      this.loadRouteSettingsFromStorage(),
    ]).then((_) => {})
  }

  /**
   * Load route settings from storage.
   */
  private async loadRouteSettingsFromStorage(): Promise<void> {
    const routes: { [key: string]: string } =
      (await browser.storage.local.get(Constants.routesStorageKey)[
        Constants.routesStorageKey
      ]) ?? {}

    this._settings.routes = routes
  }

  /**
   * Load island settings from storage.
   */
  private async loadIslandSettingsFromStorage(): Promise<void> {
    const islandCIDetails: { [key: string]: ContextualIdentityDetails } =
      (await browser.storage.local.get(Constants.islandsStorageKey))[
        Constants.islandsStorageKey
      ] ?? {}

    const islandSettings: [string, IslandDetails][] = await Promise.all(
      Object.entries(
        islandCIDetails,
      ).map((details: [string, ContextualIdentityDetails]) =>
        this.islandCIDetailsToIsland(details),
      ),
    )

    this._settings.islands = Object.fromEntries(islandSettings)
  }

  /**
   * Fill out the island details for an island setting.
   */
  private async islandCIDetailsToIsland([islandName, ciDetails]: [
    string,
    ContextualIdentityDetails,
  ]): Promise<[string, IslandDetails]> {
    const island: IslandDetails = {
      icon: ciDetails.icon,
      color: ciDetails.color,
      cookieStoreId: await this.getOrCreateCookieStoreForIsland(
        islandName,
        ciDetails,
      ),
    }

    return [islandName, island]
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

export interface Settings {
  islands: IslandSettings
  routes: RouteSettings
}

type IslandSettings = { [key: string]: IslandDetails }
type RouteSettings = { [key: string]: string }

type IslandDetails = {
  cookieStoreId: CookieStoreId
} & ContextualIdentityDetails

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
}
