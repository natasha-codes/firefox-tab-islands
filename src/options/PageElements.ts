import {
  ContextualIdentityColor,
  ContextualIdentityIcon,
  ContextualIdentityDetails,
} from "../ContextualIdentity"
import { RouteSettings, IslandSettings } from "../StorageWrapper"

export namespace Islands {
  export class Table {
    private table: HTMLTableElement
    private templateRow: TemplateRow
    private settingRows: SettingRow[] = []

    constructor(islands: IslandSettings) {
      this.table = $<HTMLTableElement>("islands-table")

      for (const [island, ciDetails] of Object.entries(islands)) {
        this.settingRows.push(
          new SettingRow(this.table.insertRow(), island, ciDetails),
        )
      }

      this.templateRow = new TemplateRow(this.table.insertRow())
    }
  }

  class SettingRow {
    private row: HTMLTableRowElement
    private name: string
    private color: ContextualIdentityColor
    private icon: ContextualIdentityIcon
    private deleteButton: HTMLButtonElement

    constructor(
      row: HTMLTableRowElement,
      name: string,
      ciDetails: ContextualIdentityDetails,
    ) {
      this.row = row

      this.name = name
      this.color = ciDetails.color
      this.icon = ciDetails.icon

      this.deleteButton = <HTMLButtonElement>document.createElement("button")
      this.deleteButton.innerText = "Delete"
      this.deleteButton.onclick = this.onDeleteClicked

      addStringToRow(this.row, this.name)
      addStringToRow(this.row, this.color)
      addStringToRow(this.row, this.icon)
      addElementToRow(this.row, this.deleteButton)
    }

    private async onDeleteClicked(): Promise<void> {
      console.log(`island ${this.name} delete clicked`)
    }
  }

  export class TemplateRow {
    private row: HTMLTableRowElement
    private nameInput: HTMLInputElement
    private colorSelect: HTMLSelectElement
    private iconSelect: HTMLSelectElement
    private submitButton: HTMLButtonElement

    constructor(row: HTMLTableRowElement) {
      this.row = row

      this.nameInput = <HTMLInputElement>document.createElement("input")
      this.nameInput.type = "text"
      this.nameInput.placeholder = "Island name"

      this.colorSelect = createSelectWithOptions(
        Object.keys(ContextualIdentityColor),
      )

      this.iconSelect = createSelectWithOptions(
        Object.keys(ContextualIdentityIcon),
      )

      this.submitButton = <HTMLButtonElement>document.createElement("button")
      this.submitButton.innerText = "Add"
      this.submitButton.onclick = this.onSubmitClicked

      addElementToRow(this.row, this.nameInput)
      addElementToRow(this.row, this.colorSelect)
      addElementToRow(this.row, this.iconSelect)
      addElementToRow(this.row, this.submitButton)
    }

    private async onSubmitClicked(): Promise<void> {
      console.log("island submit clicked")
    }
  }
}

export namespace Routes {
  export class Table {
    private table: HTMLTableElement
    private templateRow: TemplateRow
    private settingRows: SettingRow[] = []

    constructor(routes: RouteSettings, islands: string[]) {
      this.table = $<HTMLTableElement>("routes-table")

      for (const [urlFragment, island] of Object.entries(routes)) {
        this.settingRows.push(
          new SettingRow(this.table.insertRow(), urlFragment, island),
        )
      }

      this.templateRow = new TemplateRow(this.table.insertRow(), islands)
    }
  }

  class SettingRow {
    private row: HTMLTableRowElement
    private urlFragment: string
    private island: string
    private deleteButton: HTMLButtonElement

    constructor(row: HTMLTableRowElement, urlFragment: string, island: string) {
      this.row = row

      this.urlFragment = urlFragment
      this.island = island

      this.deleteButton = <HTMLButtonElement>document.createElement("button")
      this.deleteButton.innerText = "Delete"
      this.deleteButton.onclick = this.onDeleteClicked

      addStringToRow(this.row, this.urlFragment)
      addStringToRow(this.row, this.island)
      addElementToRow(this.row, this.deleteButton)
    }

    private async onDeleteClicked(): Promise<void> {
      console.log(`route ${this.urlFragment} delete clicked`)
    }
  }

  export class TemplateRow {
    private row: HTMLTableRowElement
    private urlFragmentInput: HTMLInputElement
    private islandSelect: HTMLSelectElement
    private submitButton: HTMLButtonElement

    constructor(row: HTMLTableRowElement, islands: string[]) {
      this.row = row

      this.urlFragmentInput = <HTMLInputElement>document.createElement("input")
      this.urlFragmentInput.type = "text"
      this.urlFragmentInput.placeholder = "URL fragment"

      this.islandSelect = createSelectWithOptions(islands)

      this.submitButton = <HTMLButtonElement>document.createElement("button")
      this.submitButton.innerText = "Add"
      this.submitButton.onclick = this.onSubmitClicked

      addElementToRow(this.row, this.urlFragmentInput)
      addElementToRow(this.row, this.islandSelect)
      addElementToRow(this.row, this.submitButton)
    }

    private async onSubmitClicked(): Promise<void> {
      console.log("route submit clicked")
    }
  }
}

function $<T extends HTMLElement>(id: string): T {
  return <T>document.getElementById(id)
}

function addElementToRow<E extends HTMLElement>(
  row: HTMLTableRowElement,
  element: E,
) {
  const cell = row.insertCell()
  cell.appendChild(element)
}

function addStringToRow(row: HTMLTableRowElement, value: string) {
  const cell = row.insertCell()
  cell.innerText = value
}

function createSelectWithOptions(options: string[]): HTMLSelectElement {
  const select = <HTMLSelectElement>document.createElement("select")
  for (const optionValue of options) {
    const option = <HTMLOptionElement>document.createElement("option")
    option.value = optionValue
    option.innerText = optionValue
    select.add(option)
  }

  return select
}
