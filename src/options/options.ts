import { Islands, Routes } from "./PageElements"
import { StorageWrapper } from "../StorageWrapper"

async function renderPage(): Promise<void> {
  const settings = await StorageWrapper.getStoredSettings()

  const islandsTable = new Islands.Table()
  console.log(islandsTable)

  const routesTable = new Routes.Table(Object.keys(settings.islands))
  console.log(routesTable)
}

renderPage().then(() => console.log("Page render complete"))
