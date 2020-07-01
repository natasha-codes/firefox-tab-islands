browser.tabs.onCreated.addListener(async (_) => {
  console.log("new tab!")

  const identities = await browser.contextualIdentities.query({})

  identities.forEach((id) => console.log(id))
})
