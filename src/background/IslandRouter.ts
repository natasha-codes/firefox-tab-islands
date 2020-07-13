import { Constants } from "../Types"
import { CookieStoreId, SettingsManager } from "./SettingsManager"

/**
 * `IslandRouter` listens for "main frame" web requests (requests
 * being made as the top-level request for a tab), and routes them
 * to the appropriate island (contextual identity).
 *
 * If the request is being made from its associated island (tab already has the
 * correct contextual identity) it goes through uninterrputed. Otherwise, we
 * block it and spawn a new tab in the request's island in which to replay the
 * request.
 */
export class IslandRouter {
  public static shared: IslandRouter = new IslandRouter()

  private constructor() {}

  public attach() {
    const requestFilters: browser.webRequest.RequestFilter = {
      urls: ["<all_urls>"],
      types: ["main_frame"],
    }

    const requestExtraInfoSpec: browser.webRequest.OnBeforeRequestOptions[] = [
      "blocking",
    ]

    browser.webRequest.onBeforeRequest.addListener(
      (details) => this.handleRequest(details),
      requestFilters,
      requestExtraInfoSpec,
    )
  }

  private async handleRequest(
    details: RequestDetails,
  ): Promise<browser.webRequest.BlockingResponse> {
    const matchingCookieStoreId = await this.shouldRerouteRequest(details)

    if (matchingCookieStoreId) {
      this.replayRequestInIsland(details, matchingCookieStoreId)
      return ResponseOptions.Block
    }

    return ResponseOptions.Allow
  }

  /**
   * Determines if we should reroute a request to a different island.
   *
   * @param requestDetails - request details
   * @returns null if no rerouting, or the cookie store ID to reroute to
   */
  private async shouldRerouteRequest(
    details: RequestDetails,
  ): Promise<null | CookieStoreId> {
    const mappedRequestCookieStore =
      SettingsManager.shared.getMappedCookieStoreForUrl(details.url) ??
      Constants.defaultCookieStoreId

    if (!details.cookieStoreId) {
      const message = `Missing cookie store ID for request with URL: ${details.url}`
      console.error(message)
    }

    const currentRequestCookieStore =
      details.cookieStoreId ?? Constants.defaultCookieStoreId

    return mappedRequestCookieStore === currentRequestCookieStore
      ? null
      : mappedRequestCookieStore
  }

  private async replayRequestInIsland(
    details: RequestDetails,
    islandCookieStore: CookieStoreId,
  ): Promise<browser.tabs.Tab> {
    const tabCreationDetails: TabCreationDetails = {
      url: details.url,
      cookieStoreId: islandCookieStore,
    }

    if (details.tabId !== -1) {
      tabCreationDetails.index =
        (await browser.tabs.get(details.tabId)).index + 1

      // Don't await, if this fails that's okay
      this.tabWithIdIsDiscardable(details.tabId).then(
        (isDiscardable) => isDiscardable && this.closeTabWithId(details.tabId),
      )
    }

    return browser.tabs.create(tabCreationDetails)
  }

  private async tabWithIdIsDiscardable(tabId: number): Promise<boolean> {
    return browser.tabs.get(tabId).then(
      ({ url }) =>
        Constants.defaultDiscardableTabs.has(url) ||
        // TODO: query settings for discardables
        /moz-extension.*public\/index.html/.test(url),
    )
  }

  private async closeTabWithId(tabId: number): Promise<void> {
    return browser.tabs.remove(tabId)
  }
}

interface RequestDetails {
  url: string

  // Cookie store ID of the tab making the request, if present.
  cookieStoreId?: string

  // Index of the tab the request is being made in. -1 if not
  // associated with a tab (which should never happen for us).
  tabId: number
}

interface TabCreationDetails {
  url: string
  index?: number
  cookieStoreId: CookieStoreId
}

export class ResponseOptions {
  static Allow: browser.webRequest.BlockingResponse = {}
  static Block: browser.webRequest.BlockingResponse = { cancel: true }
}
