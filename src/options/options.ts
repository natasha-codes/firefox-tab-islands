import { Constants } from "../Constants"
import * as PageActions from "./PageActions"
import { Islands } from "./PageElements"

browser.storage.onChanged.addListener((_, areaName) => {
  if (areaName !== Constants.storageArea) {
    return
  }

  PageActions.renderTables()
})

Islands.TemplateRow.submitButton.onclick = async (_): Promise<void> => {
  // Extract template info
  // Create new island with it
  await PageActions.addNewIsland()
  console.log("Island added")
}

PageActions.renderTables().then(() => console.log("Table rendering complete"))
