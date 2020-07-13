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

export interface StoredSettings {
  islands: StoredIslandSettings
  routes: StoredRouteSettings
}

export type StoredIslandSettings = { [key: string]: ContextualIdentityDetails }
export type StoredRouteSettings = { [key: string]: string }

export enum ContextualIdentityColor {
  Blue = "blue",
  Turquoise = "turquoise",
  Green = "green",
  Yellow = "yellow",
  Orange = "orange",
  Red = "red",
  Pink = "pink",
  Purple = "purple",
  Toolbar = "toolbar",
}

export enum ContextualIdentityIcon {
  Fingerprint = "fingerprint",
  Briefcase = "briefcase",
  Dollar = "dollar",
  Cart = "cart",
  Circle = "circle",
  Gift = "gift",
  Vacation = "vacation",
  Food = "food",
  Fruit = "fruit",
  Pet = "pet",
  Tree = "tree",
  Chill = "chill",
  Fence = "fence",
}

// ref - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities/create
export interface ContextualIdentityDetails {
  color?: ContextualIdentityColor
  icon?: ContextualIdentityIcon
}
