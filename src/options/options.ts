import { Constants } from "../Types"
import * as PageActions from "./PageActions"
import * as PageElements from "./PageElements"

browser.storage.onChanged.addListener((_, areaName) => {
  if (areaName !== Constants.storageArea) {
    return
  }

  PageActions.renderTables()
})

PageElements.islandTemplateSubmitButton.onclick = async (_): Promise<void> => {
  // Extract template info
  // Create new island with it
  await PageActions.addNewIsland()
  console.log("Island added")
}

PageActions.renderTables().then(() => console.log("Table rendering complete"))
