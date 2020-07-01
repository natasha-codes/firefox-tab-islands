const getMappingsArea = (): HTMLTextAreaElement =>
    <HTMLTextAreaElement>document.querySelector("#mappings")

const logError = (e: Error) => console.log(`Error: ${e}`)

function saveOptions(e: Event) {
    e.preventDefault()

    browser.storage.local
        .set({
            mappings: getMappingsArea().value,
        })
        .catch(logError)
}

function restoreOptions() {
    const setCurrentChoice = (result: {[key: string]: any}) => {
        getMappingsArea().value = result["mappings"] || {}
    }

    browser.storage.local.get("mappings").then(setCurrentChoice, logError)
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("form").addEventListener("submit", saveOptions)
