function $(id: string): HTMLElement {
  return document.getElementById(id)
}

export namespace Island {
  export const table: HTMLTableElement = <HTMLTableElement>$("islands-table")

  export namespace TemplateRow {
    export const nameInput: HTMLInputElement = <HTMLInputElement>(
      $("islands-template-row-name")
    )

    export const iconSelect: HTMLSelectElement = <HTMLSelectElement>(
      $("islands-template-row-icon")
    )

    export const colorSelect: HTMLSelectElement = <HTMLSelectElement>(
      $("islands-template-row-color")
    )

    export const submitButton: HTMLButtonElement = <HTMLButtonElement>(
      $("islands-template-row-submit-button")
    )
  }
}

export namespace Route {
  export const table: HTMLTableElement = <HTMLTableElement>$("routes-table")
}
