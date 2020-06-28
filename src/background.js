browser.tabs.onCreated.addListener((_) => {
  console.log("new tab!")
  browser.contextualIdentities.query({}).then(identities => {
    identities.forEach(id => console.log(id))
  })
})

browser.storage.local.set({ foo: "bar" })
