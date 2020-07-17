import { Islands, Routes, IO } from "./PageElements"
import * as PageActions from "./PageActions"
import { StorageWrapper } from "../StorageWrapper"
import { ContextualIdentityDetails } from "../ContextualIdentity"

async function renderPage(): Promise<void> {
  const settings = await StorageWrapper.getStoredSettings()

  const islandsTable = new Islands.Table(
    $<HTMLTableElement>("islands-table"),
    settings.islands,
    onIslandSubmitButtonClicked,
    onIslandDeleteButtonClicked,
  )
  console.log(islandsTable)

  const routesTable = new Routes.Table(
    $<HTMLTableElement>("routes-table"),
    settings.routes,
    Object.keys(settings.islands),
    onRouteSubmitButtonClicked,
    onRouteDeleteButtonClicked,
  )
  console.log(routesTable)

  new IO.ExportButton($<HTMLButtonElement>("export-button"), () =>
    PageActions.exportSettings(),
  )

  new IO.ImportInput(
    $<HTMLInputElement>("import-input"),
    onSettingsFileSelected,
  )
}

function $<T extends HTMLElement>(id: string): T {
  return <T>document.getElementById(id)
}

function onIslandSubmitButtonClicked(
  island: string,
  ciDetails: ContextualIdentityDetails,
) {
  PageActions.createIsland(island, ciDetails).then((success) => {
    if (success) {
      PageActions.reloadPage()
    }
  })
}

function onIslandDeleteButtonClicked(
  island: string,
  ciDetails: ContextualIdentityDetails,
) {
  PageActions.deleteIsland(island).then((success) => {
    if (success) {
      PageActions.reloadPage()
    }
  })
}

function onRouteSubmitButtonClicked(urlFragment: string, island: string) {
  PageActions.createRoute(urlFragment, island).then((success) => {
    if (success) {
      PageActions.reloadPage()
    }
  })
}

function onRouteDeleteButtonClicked(urlFragment: string, island: string) {
  PageActions.deleteRoute(urlFragment).then((success) => {
    if (success) {
      PageActions.reloadPage()
    }
  })
}

function onSettingsFileSelected(file: File) {
  PageActions.importSettingsFromFile(file).then((success) => {
    if (success) {
      PageActions.reloadPage()
    }
  })
}

renderPage().then(() => console.log("Page render complete"))
