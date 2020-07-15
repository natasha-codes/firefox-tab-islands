import { ContextualIdentityDetails } from "./ContextualIdentity"

export class StorageWrapper {
  static async getStoredSettings(): Promise<Settings> {
    const rawStoredSettings = await browser.storage.local.get([
      StorageConstants.islandsStorageKey,
      StorageConstants.routesStorageKey,
    ])

    return {
      islands: rawStoredSettings[StorageConstants.islandsStorageKey] ?? {},
      routes: rawStoredSettings[StorageConstants.routesStorageKey] ?? {},
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
    let islands = (await this.getStoredSettings()).islands

    if (name in islands) {
      return false
    }

    islands[name] = ciDetails

    await browser.storage.local.set({
      [StorageConstants.islandsStorageKey]: islands,
    })

    return true
  }
}

export interface Settings {
  islands: IslandSettings
  routes: RouteSettings
}

export type IslandSettings = { [key: string]: ContextualIdentityDetails }
export type RouteSettings = { [key: string]: string }

class StorageConstants {
  static islandsStorageKey: string = "islands"
  static routesStorageKey: string = "routes"
}
