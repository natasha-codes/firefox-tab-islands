import { Islands, Routes } from "./PageElements"
import { StorageWrapper } from "../StorageWrapper"
import { ContextualIdentityDetails } from "../ContextualIdentity"

async function renderPage(): Promise<void> {
  const settings = await StorageWrapper.getStoredSettings()

  const islandsTable = new Islands.Table(
    settings.islands,
    onIslandSubmitButtonClicked,
    onIslandDeleteButtonClicked,
  )
  console.log(islandsTable)

  const routesTable = new Routes.Table(
    settings.routes,
    Object.keys(settings.islands),
    onRouteSubmitButtonClicked,
    onRouteDeleteButtonClicked,
  )
  console.log(routesTable)
}

function onIslandSubmitButtonClicked(
  island: string,
  ciDetails: ContextualIdentityDetails,
) {
  console.log(`Submit clicked for island: ${island} => ${ciDetails}`)
}

function onIslandDeleteButtonClicked(
  island: string,
  ciDetails: ContextualIdentityDetails,
) {
  console.log(`Delete clicked for island: ${island} => ${ciDetails}`)
}

function onRouteSubmitButtonClicked(urlFragment: string, island: string) {
  console.log(`Submit clicked for route: ${urlFragment} => ${island}`)
}

function onRouteDeleteButtonClicked(urlFragment: string, island: string) {
  console.log(`Delete clicked for route: ${urlFragment} => ${island}`)
}

renderPage().then(() => console.log("Page render complete"))
