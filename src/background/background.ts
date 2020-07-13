import { CookieStoreManager } from "./CookieStoreManager"
import { IslandRouter } from "./IslandRouter"

const main = async () => {
  await CookieStoreManager.shared.attach()

  IslandRouter.shared.attach()

  // launch options page when user clicks button in toolbar
  // ref - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Add_a_button_to_the_toolbar
  browser.browserAction.onClicked.addListener(() =>
    // ref - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Implement_a_settings_page
    browser.runtime.openOptionsPage(),
  )
}

main()
