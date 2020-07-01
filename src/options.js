function saveOptions(e) {
  e.preventDefault()
  browser.storage.local.set({
    mappings: document.querySelector("#mappings").value,
  })
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#mappings").value = result.mappings || {}
  }

  let getting = browser.storage.local.get("mappings")
  getting.then(setCurrentChoice, (e) => console.log(`Error: ${e}`))
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("form").addEventListener("submit", saveOptions)
