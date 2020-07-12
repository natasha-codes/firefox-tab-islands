function $(id: string): HTMLElement {
  return document.getElementById(id)
}

export function islandTemplateSubmitButton(): HTMLButtonElement {
  return <HTMLButtonElement>$("islands-template-row-submit-button")
}
