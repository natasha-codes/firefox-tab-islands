import { ContextualIdentityDetails } from "../ContextualIdentity"
import { StorageWrapper } from "../StorageWrapper"

export function reloadPage() {
  location.reload()
}

export async function createIsland(
  island: string,
  ciDetails: ContextualIdentityDetails,
): Promise<boolean> {
  return StorageWrapper.createIsland(island, ciDetails).then((success) => {
    if (success) {
      console.log(`Island ${island} created!`)
    } else {
      console.error(`Island ${island} could not be created`)
    }

    return success
  })
}

export async function deleteIsland(island: string): Promise<boolean> {
  return StorageWrapper.deleteIsland(island).then((success) => {
    if (success) {
      console.log(`Island ${island} deleted`)
    } else {
      console.error(`Island ${island} could not be deleted`)
    }

    return success
  })
}

export async function createRoute(
  urlFragment: string,
  island: string,
): Promise<boolean> {
  return StorageWrapper.createRoute(urlFragment, island).then((success) => {
    if (success) {
      console.log(`Route ${urlFragment} => ${island} created`)
    } else {
      console.error(`Route ${urlFragment} => ${island} could not be created`)
    }

    return success
  })
}

export async function deleteRoute(urlFragment: string): Promise<boolean> {
  return StorageWrapper.deleteRoute(urlFragment).then((success) => {
    if (success) {
      console.log(`Route for ${urlFragment} deleted`)
    } else {
      console.error(`Route for ${urlFragment} could not be deleted`)
    }

    return success
  })
}

export async function exportSettings(): Promise<void> {
  return StorageWrapper.exportSettings()
}

export async function importSettingsFromFile(file: File): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (loaded) => {
      try {
        // `string` here because we call `readAsText` below
        const settingsJSON = JSON.parse(loaded.target.result as string)

        StorageWrapper.importSettings(settingsJSON).then((success) => {
          if (success) {
            console.log("Settings imported")
          } else {
            console.error("Settings could not be imported")
          }

          resolve(success)
        })
      } catch {
        console.error("Settings file failed to parse")
        reject()
      }
    }

    reader.readAsText(file)
  })
}
