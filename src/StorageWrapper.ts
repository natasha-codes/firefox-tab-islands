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

  /**
   * Create an island with the given name and details.
   *
   * Resolves with `false` if island already existed.
   */
  static async createIsland(
    name: string,
    ciDetails: ContextualIdentityDetails,
  ): Promise<boolean> {
    if (name in (await this.getStoredSettings()).islands) {
      return false
    }

    await browser.storage.local.set({ [name]: ciDetails })
    return true
  }
}

export interface Settings {
  islands: IslandSettings
  routes: RouteSettings
}

export type IslandSettings = { [key: string]: ContextualIdentityDetails }
export type RouteSettings = { [key: string]: string }
