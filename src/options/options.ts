/**
 * Handle settings JSON upload, storing the settings in local storage
 *
 * ref - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files#Open_files_in_an_extension_using_a_file_picker
 */

// NOTE: this cannot be defined as a lambda function as we will then not have
// access to the correct proprty on this
function handleFiles() {
  // returns an array of files even when only one uploaded
  const file = this.files[0]

  const reader = new FileReader()

  reader.onload = loaded => {
    // `string` here because we call `readAsText` below (don't love the api)
    const parsed = JSON.parse(loaded.target.result as string)

    // TODO: valiadate JSON
    browser.storage.local.set({
      ...parsed,
    })

    document.getElementById("status").innerHTML = "Settings saved!"
  }

  reader.readAsText(file)
}

document
  .getElementById("settingsJSON")
  .addEventListener("change", handleFiles, false)
