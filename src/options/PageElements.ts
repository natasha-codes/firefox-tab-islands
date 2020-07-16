import {
  ContextualIdentityColor,
  ContextualIdentityIcon,
  ContextualIdentityDetails,
} from "../ContextualIdentity"
import { RouteSettings, IslandSettings } from "../StorageWrapper"

export namespace Islands {
  type OnButtonClicked = (
    island: string,
    ciDetails: ContextualIdentityDetails,
  ) => void

  export class Table {
    private table: HTMLTableElement
    private templateRow: TemplateRow
    private settingRows: SettingRow[] = []

    constructor(
      table: HTMLTableElement,
      islands: IslandSettings,
      onSubmitButtonClicked: OnButtonClicked,
      onDeleteButtonClicked: OnButtonClicked,
    ) {
      this.table = table

      for (const [island, ciDetails] of Object.entries(islands)) {
        this.settingRows.push(
          new SettingRow(
            this.table.insertRow(),
            island,
            ciDetails,
            onDeleteButtonClicked,
          ),
        )
      }

      this.templateRow = new TemplateRow(
        this.table.insertRow(),
        onSubmitButtonClicked,
      )
    }
  }

  class SettingRow {
    private row: HTMLTableRowElement
    private name: string
    private color: ContextualIdentityColor
    private icon: ContextualIdentityIcon
    private deleteButton: HTMLButtonElement
    private onDeleteButtonClicked: OnButtonClicked

    constructor(
      row: HTMLTableRowElement,
      name: string,
      ciDetails: ContextualIdentityDetails,
      onDeleteButtonClicked: (
        island: string,
        ciDetails: ContextualIdentityDetails,
      ) => void,
    ) {
      this.row = row

      this.name = name
      this.color = ciDetails.color
      this.icon = ciDetails.icon

      this.deleteButton = document.createElement("button")
      this.deleteButton.innerText = "Delete"
      this.deleteButton.onclick = () => this.onDeleteClicked()

      this.onDeleteButtonClicked = onDeleteButtonClicked

      addStringToRow(this.row, this.name)
      addStringToRow(this.row, this.color)
      addStringToRow(this.row, this.icon)
      addElementToRow(this.row, this.deleteButton)
    }

    private onDeleteClicked() {
      this.onDeleteButtonClicked(this.name, {
        color: this.color,
        icon: this.icon,
      })
    }
  }

  export class TemplateRow {
    private row: HTMLTableRowElement
    private nameInput: HTMLInputElement
    private colorSelect: HTMLSelectElement
    private iconSelect: HTMLSelectElement
    private submitButton: HTMLButtonElement
    private onSubmitButtonClicked: OnButtonClicked

    constructor(
      row: HTMLTableRowElement,
      onSubmitButtonClicked: OnButtonClicked,
    ) {
      this.row = row

      this.nameInput = document.createElement("input")
      this.nameInput.type = "text"
      this.nameInput.placeholder = "Island name"

      this.colorSelect = createSelectWithOptions(
        Object.keys(ContextualIdentityColor),
      )

      this.iconSelect = createSelectWithOptions(
        Object.keys(ContextualIdentityIcon),
      )

      this.submitButton = document.createElement("button")
      this.submitButton.innerText = "Add"
      this.submitButton.onclick = () => this.onSubmitClicked()

      this.onSubmitButtonClicked = onSubmitButtonClicked

      addElementToRow(this.row, this.nameInput)
      addElementToRow(this.row, this.colorSelect)
      addElementToRow(this.row, this.iconSelect)
      addElementToRow(this.row, this.submitButton)
    }

    private onSubmitClicked() {
      const name = this.nameInput.value

      const colorValue = this.colorSelect.value
      const color: ContextualIdentityColor = ContextualIdentityColor[colorValue]

      const iconValue = this.iconSelect.value
      const icon: ContextualIdentityIcon = ContextualIdentityIcon[iconValue]

      this.onSubmitButtonClicked(name, { color, icon })
    }
  }
}

export namespace Routes {
  type OnButtonClicked = (urlFragment: string, island: string) => void

  export class Table {
    private table: HTMLTableElement
    private templateRow: TemplateRow
    private settingRows: SettingRow[] = []

    constructor(
      table: HTMLTableElement,
      routes: RouteSettings,
      islands: string[],
      onSubmitButtonClicked: OnButtonClicked,
      onDeleteButtonClicked: OnButtonClicked,
    ) {
      this.table = table

      for (const [urlFragment, island] of Object.entries(routes)) {
        this.settingRows.push(
          new SettingRow(
            this.table.insertRow(),
            urlFragment,
            island,
            onDeleteButtonClicked,
          ),
        )
      }

      this.templateRow = new TemplateRow(
        this.table.insertRow(),
        islands,
        onSubmitButtonClicked,
      )
    }
  }

  class SettingRow {
    private row: HTMLTableRowElement
    private urlFragment: string
    private island: string
    private deleteButton: HTMLButtonElement
    private onDeleteButtonClicked: OnButtonClicked

    constructor(
      row: HTMLTableRowElement,
      urlFragment: string,
      island: string,
      onDeleteButtonClicked: OnButtonClicked,
    ) {
      this.row = row

      this.urlFragment = urlFragment
      this.island = island

      this.deleteButton = <HTMLButtonElement>document.createElement("button")
      this.deleteButton.innerText = "Delete"
      this.deleteButton.onclick = () => this.onDeleteClicked()

      this.onDeleteButtonClicked = onDeleteButtonClicked

      addStringToRow(this.row, this.urlFragment)
      addStringToRow(this.row, this.island)
      addElementToRow(this.row, this.deleteButton)
    }

    private async onDeleteClicked(): Promise<void> {
      this.onDeleteButtonClicked(this.urlFragment, this.island)
    }
  }

  export class TemplateRow {
    private row: HTMLTableRowElement
    private urlFragmentInput: HTMLInputElement
    private islandSelect: HTMLSelectElement
    private submitButton: HTMLButtonElement
    private onSubmitButtonClicked: OnButtonClicked

    constructor(
      row: HTMLTableRowElement,
      islands: string[],
      onSubmitButtonClicked: OnButtonClicked,
    ) {
      this.row = row

      this.urlFragmentInput = document.createElement("input")
      this.urlFragmentInput.type = "text"
      this.urlFragmentInput.placeholder = "URL fragment"

      this.islandSelect = createSelectWithOptions(islands)

      this.submitButton = document.createElement("button")
      this.submitButton.innerText = "Add"
      this.submitButton.onclick = () => this.onSubmitClicked()

      this.onSubmitButtonClicked = onSubmitButtonClicked

      addElementToRow(this.row, this.urlFragmentInput)
      addElementToRow(this.row, this.islandSelect)
      addElementToRow(this.row, this.submitButton)
    }

    private async onSubmitClicked(): Promise<void> {
      this.onSubmitButtonClicked(
        this.urlFragmentInput.value,
        this.islandSelect.value,
      )
    }
  }
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
  const select = document.createElement("select")
  for (const optionValue of options) {
    const option = document.createElement("option")
    option.value = optionValue
    option.innerText = optionValue
    select.add(option)
  }

  return select
}
