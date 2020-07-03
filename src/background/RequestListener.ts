export class RequestListener {
    public static shared: RequestListener = new RequestListener()

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
            this.onBeforeRequest,
            requestFilters,
            requestExtraInfoSpec,
        )
    }

    private onBeforeRequest(details: any): browser.webRequest.BlockingResponse {
        console.log("details:")
        console.log(details)

        return {}
    }
}
