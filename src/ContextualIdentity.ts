export enum ContextualIdentityColor {
  blue = "blue",
  turquoise = "turquoise",
  green = "green",
  yellow = "yellow",
  orange = "orange",
  red = "red",
  pink = "pink",
  purple = "purple",
  toolbar = "toolbar",
}

export enum ContextualIdentityIcon {
  fingerprint = "fingerprint",
  briefcase = "briefcase",
  dollar = "dollar",
  cart = "cart",
  circle = "circle",
  gift = "gift",
  vacation = "vacation",
  food = "food",
  fruit = "fruit",
  pet = "pet",
  tree = "tree",
  chill = "chill",
  fence = "fence",
}

// ref - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities/create
export interface ContextualIdentityDetails {
  color: ContextualIdentityColor
  icon: ContextualIdentityIcon
}
