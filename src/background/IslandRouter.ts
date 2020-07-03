import {Constants} from "../Constants"
import {CookieStoreId, IslandManager} from "./IslandManager"

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
            this.openTabForUrlInIsland(details.url, matchingCookieStoreId)
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
            IslandManager.shared.getMappedCookieStoreForUrl(details.url) ??
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

    private openTabForUrlInIsland(
        url: string,
        islandCookieStore: CookieStoreId,
    ) {
        browser.tabs.create({
            url: url,
            cookieStoreId: islandCookieStore,
        })
    }
}

interface RequestDetails {
    url: string
    cookieStoreId?: string
    tabId: number
}

namespace ResponseOptions {
    export const Allow: browser.webRequest.BlockingResponse = {}
    export const Block: browser.webRequest.BlockingResponse = {cancel: true}
}
