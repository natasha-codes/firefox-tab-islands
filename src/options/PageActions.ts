import { Constants } from "../Constants"
import {
  ContextualIdentityColor,
  ContextualIdentityIcon,
} from "../ContextualIdentity"
import { Settings, StorageWrapper } from "../StorageWrapper"
import * as PageElements from "./PageElements"

export async function renderTables(): Promise<void> {
  // get from storage
  // do rows stuff
  // based on storage

  const settings: Settings = await StorageWrapper.getStoredSettings()

  console.log(settings)

  const islandRows: IslandRow[] = Object.entries(settings.islands).map(
    ([name, { color, icon }]) => new IslandRow(name, color, icon),
  )

  for (const islandRow of islandRows) {
    const newTableRow = PageElements.islandTable.insertRow(
      PageElements.islandTable.rows.length - 1,
    )
    islandRow.configureHTMLRow(newTableRow)
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
