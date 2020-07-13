function $(id: string): HTMLElement {
  return document.getElementById(id)
}

export const islandTemplateSubmitButton: HTMLButtonElement = <
  HTMLButtonElement
>$("islands-template-row-submit-button")

export const islandTable: HTMLTableElement = <HTMLTableElement>(
  $("islands-table")
)
