export class Constants {
  static defaultCookieStoreId: string = "firefox-default"
  static islandsStorageKey: string = "islands"
  static routesStorageKey: string = "routes"
  static storageArea: string = "local"
  static defaultDiscardableTabs: Set<String> = new Set([
    "about:startpage",
    "about:newtab",
    "about:home",
    "about:blank",
  ])
}
