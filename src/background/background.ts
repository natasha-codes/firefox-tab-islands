import {RequestListener} from "./RequestListener"

const requestListener = new RequestListener()

requestListener.foo()

/*
browser.storage.local.get("mappings").then((res) => {
    console.log(JSON.parse(res.mappings))
})

browser.storage.onChanged.addListener((changes, areaName) => {
    console.log("changes: ", changes)
    console.log("areaName: ", areaName)
})

browser.tabs.onUpdated.addListener(async (id, changeInfo, tab) => {
    if (changeInfo.status === "loading") {
        console.log("tab updated!")
        console.log("id: ", id)
        console.log("changeInfo: ", changeInfo)
        console.log("tab: ", tab)
    }
    // const identities = await browser.contextualIdentities.query({})
    // identities.forEach((id) => console.log(id))
})
*/
