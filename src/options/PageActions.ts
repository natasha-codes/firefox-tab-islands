import { ContextualIdentityDetails } from "../ContextualIdentity"
import { StorageWrapper } from "../StorageWrapper"

export function reloadPage() {
  location.reload()
}

export async function createIsland(
  island: string,
  ciDetails: ContextualIdentityDetails,
): Promise<void> {
  if (await StorageWrapper.createIsland(island, ciDetails)) {
    console.log(`Island ${island} created!`)
  } else {
    console.error(`Island ${island} could not be created`)
  }
}

export async function deleteIsland(island: string) {
  if (await StorageWrapper.deleteIsland(island)) {
    console.log(`Island ${island} deleted`)
  } else {
    console.error(`Island ${island} could not be deleted`)
  }
}

export async function createRoute(
  urlFragment: string,
  island: string,
): Promise<void> {
  if (await StorageWrapper.createRoute(urlFragment, island)) {
    console.log(`Route ${urlFragment} => ${island} created`)
  } else {
    console.log(`Route ${urlFragment} => ${island} could not be created`)
  }
}

export async function deleteRoute(urlFragment: string) {
  if (await StorageWrapper.deleteRoute(urlFragment)) {
    console.log(`Route for ${urlFragment} deleted`)
  } else {
    console.error(`Route for ${urlFragment} could not be deleted`)
  }
}
