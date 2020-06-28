browser.tabs.onCreated.addListener((_) => console.log("new tab!"))

browser.storage.local.set({ foo: "bar" })
