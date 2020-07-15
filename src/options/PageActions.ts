import {
  ContextualIdentityColor,
  ContextualIdentityIcon,
} from "../ContextualIdentity"
import {
  Settings,
  StorageWrapper,
  IslandSettings,
  RouteSettings,
} from "../StorageWrapper"
import { Islands, Routes } from "./PageElements"

export async function renderTables(): Promise<void> {
  const settings: Settings = await StorageWrapper.getStoredSettings()

  renderIslandsTableTemplateRow()
  renderIslandsTableSettingsRows(settings.islands)

  renderRoutesTableTemplateRow(Object.keys(settings.islands))
  renderRoutesTableSettingsRows(settings.routes)
}

function renderIslandsTableTemplateRow() {
  Islands.TemplateRow.nameInput.placeholder = "Island name"

  for (const color of Object.values(ContextualIdentityColor)) {
    const option = <HTMLOptionElement>document.createElement("option")
    option.value = color
    option.innerText = color
    Islands.TemplateRow.colorSelect.add(option)
  }

  for (const icon of Object.values(ContextualIdentityIcon)) {
    const option = <HTMLOptionElement>document.createElement("option")
    option.value = icon
    option.innerText = icon
    Islands.TemplateRow.iconSelect.add(option)
  }
}

function renderIslandsTableSettingsRows(islandSettings: IslandSettings) {
  const islandRows: IslandRow[] = Object.entries(islandSettings).map(
    ([name, { color, icon }]) => new IslandRow(name, color, icon),
  )

  for (const islandRow of islandRows) {
    const newTableRow = Islands.table.insertRow(Islands.table.rows.length - 1)
    islandRow.configureHTMLRow(newTableRow)
  }
}

function renderRoutesTableTemplateRow(islandNames: string[]) {
  Routes.TemplateRow.urlInput.placeholder = "URL fragment"

  for (const island of islandNames) {
    const option = <HTMLOptionElement>document.createElement("option")
    option.value = island
    option.innerText = island
    Routes.TemplateRow.islandSelect.add(option)
  }
}

function renderRoutesTableSettingsRows(routeSettings: RouteSettings) {
  const routeRows: RouteRow[] = Object.entries(routeSettings).map(
    ([url, island]) => new RouteRow(url, island),
  )

  for (const routeRow of routeRows) {
    const newRouteRow = Routes.table.insertRow(Routes.table.rows.length - 1)
    routeRow.configureHTMLRow(newRouteRow)
  }
}

export async function addNewIsland(): Promise<void> {
  // get row information about island
  // save it

  renderTables()
}

export async function addNewRoute(): Promise<void> {
  // get row information about route
  // save it

  renderTables()
}

export async function importConfigFile(): Promise<void> {
  // take in file upload
  // save it

  renderTables()
}

export async function exportConfigFile(): Promise<void> {
  // read storage, convert to JSON
  // make the browser download it
  // no need to re-render
}

class IslandRow {
  name: string
  color: ContextualIdentityColor
  icon: ContextualIdentityIcon

  constructor(
    name: string,
    color: ContextualIdentityColor,
    icon: ContextualIdentityIcon,
  ) {
    this.name = name
    this.color = color
    this.icon = icon
  }

  configureHTMLRow(htmlRow: HTMLTableRowElement) {
    const nameCell = htmlRow.insertCell()
    const colorCell = htmlRow.insertCell()
    const iconCell = htmlRow.insertCell()

    nameCell.innerText = this.name
    colorCell.innerText = this.color
    iconCell.innerText = this.icon
  }
}

class RouteRow {
  url: string
  island: string

  constructor(url: string, island: string) {
    this.url = url
    this.island = island
  }

  configureHTMLRow(htmlRow: HTMLTableRowElement) {
    const urlCell = htmlRow.insertCell()
    const islandCell = htmlRow.insertCell()

    urlCell.innerText = this.url
    islandCell.innerText = this.island
  }
}
