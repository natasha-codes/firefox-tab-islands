import { Islands, Routes } from "./PageElements"
import * as PageActions from "./PageActions"
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
  PageActions.createIsland(island, ciDetails).then(() => {
    PageActions.reloadPage()
  })
}

function onIslandDeleteButtonClicked(
  island: string,
  ciDetails: ContextualIdentityDetails,
) {
  PageActions.deleteIsland(island).then(() => {
    PageActions.reloadPage()
  })
}

function onRouteSubmitButtonClicked(urlFragment: string, island: string) {
  PageActions.createRoute(urlFragment, island).then(() => {
    PageActions.reloadPage()
  })
}

function onRouteDeleteButtonClicked(urlFragment: string, island: string) {
  PageActions.deleteRoute(urlFragment).then(() => {
    PageActions.reloadPage()
  })
}

renderPage().then(() => console.log("Page render complete"))
