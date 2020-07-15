import { renderTables, reloadPage, addNewIsland } from "./PageActions"
import { Islands, Routes } from "./PageElements"

Islands.TemplateRow.submitButton.onclick = async () => {
  await addNewIsland().catch((e) =>
    console.error("Failed to add new island: ", e),
  )

  reloadPage()
  renderTables()
}

renderTables().then(() => console.log("Table rendering complete"))
