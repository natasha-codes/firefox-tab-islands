import { Constants } from "../Constants"
import * as PageActions from "./PageActions"
import * as PageElements from "./PageElements"

document.onload = (_) => {
  browser.storage.onChanged.addListener((_, areaName) => {
    if (areaName !== Constants.storageArea) {
      return
    }

    PageActions.renderTables()
  })

  PageActions.renderTables()
}

PageElements.islandTemplateSubmitButton().onclick = (_) => {
  console.log("clickt")
}

PageActions.renderTables()
