function $(id: string): HTMLElement {
  return document.getElementById(id)
}

export namespace Islands {
  export const table: HTMLTableElement = <HTMLTableElement>$("islands-table")

  export namespace TemplateRow {
    export const nameInput: HTMLInputElement = <HTMLInputElement>(
      $("islands-template-row-name-input")
    )

    export const colorSelect: HTMLSelectElement = <HTMLSelectElement>(
      $("islands-template-row-color-select")
    )

    export const iconSelect: HTMLSelectElement = <HTMLSelectElement>(
      $("islands-template-row-icon-select")
    )

    export const submitButton: HTMLButtonElement = <HTMLButtonElement>(
      $("islands-template-row-submit-button")
    )
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
