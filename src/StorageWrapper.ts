import { ContextualIdentityDetails } from "./ContextualIdentity"
import { Constants } from "./Constants"

export class StorageWrapper {
  static async getStoredSettings(): Promise<Settings> {
    const rawStoredSettings = await browser.storage.local.get([
      Constants.islandsStorageKey,
      Constants.routesStorageKey,
    ])

    return {
      islands: rawStoredSettings[Constants.islandsStorageKey] ?? {},
      routes: rawStoredSettings[Constants.routesStorageKey] ?? {},
    }
  }
}

export interface Settings {
  islands: IslandSettings
  routes: RouteSettings
}

export type IslandSettings = { [key: string]: ContextualIdentityDetails }
export type RouteSettings = { [key: string]: string }
