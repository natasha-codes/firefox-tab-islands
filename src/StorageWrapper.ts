import { ContextualIdentityDetails } from "./ContextualIdentity"
import { Constants } from "./Constants"

export class StorageWrapper {
  static async getStoredSettings(): Promise<StoredSettings> {
    const rawStoredSettings = await browser.storage.local.get([
      Constants.islandsStorageKey,
      Constants.routesStorageKey,
    ])

    return {
      islands: rawStoredSettings[Constants.islandsStorageKey] ?? {},
      routes: rawStoredSettings[Constants.routesStorageKey] ?? {},
    }
  }

  static async getStoredIslandSetting(): Promise<StoredIslandSettings> {
    return this.getStoredSettings().then((settings) => settings.islands)
  }

  static async getStoredRouteSettings(): Promise<StoredRouteSettings> {
    return this.getStoredSettings().then((settings) => settings.routes)
  }
}

export interface Settings {
  islands: IslandSettings
  routes: RouteSettings
}

export type IslandSettings = { [key: string]: ContextualIdentityDetails }
export type RouteSettings = { [key: string]: string }
