import {
  ContextualIdentityColor,
  ContextualIdentityIcon,
  ContextualIdentityDetails,
} from "../ContextualIdentity"

function $<T extends HTMLElement>(id: string): T {
  return <T>document.getElementById(id)
}

export namespace Islands {
  export class Table {
    private table: HTMLTableElement
    private templateRow: TemplateRow
    private settingRows: SettingRow[]

    constructor() {
      this.table = $<HTMLTableElement>("islands-table")

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

      SettingRow.addStringToRow(this.row, this.name)
      SettingRow.addStringToRow(this.row, this.color)
      SettingRow.addStringToRow(this.row, this.icon)
      SettingRow.addElementToRow(this.row, this.deleteButton)
    }

    private async onDeleteClicked(): Promise<void> {
      console.log(`island ${name} delete clicked`)
    }

    private static addStringToRow(row: HTMLTableRowElement, value: string) {
      const cell = row.insertCell()
      cell.innerText = value
    }

    private static addElementToRow<E extends HTMLElement>(
      row: HTMLTableRowElement,
      element: E,
    ) {
      const cell = row.insertCell()
      cell.appendChild(element)
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
      this.nameInput.placeholder = "SECONDARY Island name"

      this.colorSelect = TemplateRow.createSelectWithOptions(
        Object.keys(ContextualIdentityColor),
      )

      this.iconSelect = TemplateRow.createSelectWithOptions(
        Object.keys(ContextualIdentityIcon),
      )

      this.submitButton = <HTMLButtonElement>document.createElement("button")
      this.submitButton.innerText = "Add"
      this.submitButton.onclick = this.onSubmitClicked

      TemplateRow.addElementToRow(this.row, this.nameInput)
      TemplateRow.addElementToRow(this.row, this.colorSelect)
      TemplateRow.addElementToRow(this.row, this.iconSelect)
      TemplateRow.addElementToRow(this.row, this.submitButton)
    }

    private async onSubmitClicked(): Promise<void> {
      console.log("island submit clicked")
    }

    private static addElementToRow<E extends HTMLElement>(
      row: HTMLTableRowElement,
      element: E,
    ) {
      const cell = row.insertCell()
      cell.appendChild(element)
    }

    private static createSelectWithOptions(
      options: string[],
    ): HTMLSelectElement {
      const select = <HTMLSelectElement>document.createElement("select")
      for (const optionValue of options) {
        const option = <HTMLOptionElement>document.createElement("option")
        option.value = optionValue
        option.innerText = optionValue
        select.add(option)
      }

      return select
    }
  }
}

export namespace Routes {
  export const table: HTMLTableElement = <HTMLTableElement>$("routes-table")

  export namespace TemplateRow {
    export const urlInput: HTMLInputElement = <HTMLInputElement>(
      $("routes-template-row-url-input")
    )

    export const islandSelect: HTMLSelectElement = <HTMLSelectElement>(
      $("routes-template-row-icon-select")
    )

    export const submitButton: HTMLButtonElement = <HTMLButtonElement>(
      $("routes-template-row-submit-button")
    )
  }
}
