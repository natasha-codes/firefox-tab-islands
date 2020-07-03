import {Constants} from "../Constants"
import {CookieStoreId, StorageManager} from "./StorageManager"

/**
 * `IslandRouter` listens for "main frame" web requests (requests
 * being made as the top-level request for a tab), and routes them
 * to the appropriate island (contextual identity).
 *
 * If the request being made's tab is a part the island the request
 * belongs to, it goes through uninterrputed. Otherwise, we block it
 * and spawn a new tab in the request's island in which to replay
 * the request.
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
            this.handleRequest,
            requestFilters,
            requestExtraInfoSpec,
        )
    }

    private async handleRequest(
        details: RequestDetails,
    ): Promise<browser.webRequest.BlockingResponse> {
        const rerouteToCookieStore = await this.shouldRerouteRequest(details)

        if (rerouteToCookieStore) {
            this.openTabForUrlInIsland(details.url, rerouteToCookieStore)
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
            (await StorageManager.shared.getMappedCookieStoreForUrl(
                details.url,
            )) ?? Constants.defaultCookieStoreId

        if (!!details.cookieStoreId) {
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
