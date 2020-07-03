# Firefox Tab Islands

Assign URLs to open in "tab islands" to isolate the cookies, logins, and tracking information they share.

`Tab Islands` is designed to be:

-   Strict by default: only URLs assigned to an island will open in that island.
-   Lightweight: small featureset relying on Firefox's native
    [contextual identities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_contextual_identities).
-   Portable: use the same config across anywhere you use Firefox.

## How Islands work

An `Island` represents a Firefox "contextual identity" (CI). From Mozilla:

> "Contextual identities", also known as "containers", are a browser feature
> which addresses the idea that users assume multiple identities when browsing
> the web, and wish to maintain some separation between these identities.
>
> https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities

CIs are useful to anyone who might use the web with multiple "identities":

> Users can log into multiple accounts on the same site, even when the site
> does not natively support concurrent sessions.
>
> -   A user may wants (sic) to manage their work and personal Gmail accounts
>     side-by-side in the same window.
> -   A user has a Facebook or eBay account for their business and one for their
>     personal life.
>
> https://wiki.mozilla.org/Security/Contextual_Identity_Project/Containers#Benefits_and_Use_Cases

They also provide significant privacy protections against tracking sites:

> Provides protection against tracking while still providing access to
> services
>
> -   A user wants to log into Facebook and keep the
>     site open while they browse the web, but doesn't want Facebook buttons to
>     track them across sites.
> -   A user wants to use Gmail but doesn't want their google searches linked
>     to their Google account.
>
> https://wiki.mozilla.org/Security/Contextual_Identity_Project/Containers#Benefits_and_Use_Cases

## What this extension does

This extension allows users to associate a URL (or partial URL) with a
CI. It then enforces that when the user navigates to a URL associated with a
CI, the tab that URL opens in belongs to that CI. It also enforces that _only_
URLs associated with a CI will open in tabs belonging to that CI. URLs not
associated with a CI open in the "default" CI.

### A case study in Google, Facebook, and the NYTimes

For example, imagine you have a CI for your Google account and a CI for your
Facebook account. Say you're reading the NYTimes in a tab with no associated
CI, and you want to send an email. If you type in `mail.google.com` to the
Firefox URL bar, `Tab Islands` will open a new tab in your Google CI and load
your email - isolating your news article from your Google accounts, and
ensuring you're logged into your email automatically.

Now imagine you get an email with a Facebook link in it, and click it.
`Tab Islands` will then open a new tab in your Facebook CI and open the link
there, isolating your Facebook activity from your Google accounts (and vice
versa).

Now imagine you want to go back to reading the news, and you type in
`nytimes.com` to the URL bar. `Tab Islands` will open another new tab, this
time in the default CI, isolating your news articles from both your Facebook
and Google accounts.

And this all happens automatically!

## Installing

`Tab Islands` is (or will soon be) available on the
[Firefox Addons store](https://addons.mozilla.org)!

### Setting up your contextual identities

TODO: add instructions for creating and installing URL <-> CI mappings.

## Development

To get started, clone or fork this repo and run:

```shell
$ yarn install # or `npm`
$ yarn build
```

Then, follow
[Mozilla's official steps](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Trying_it_out)
to install/debug a temporary addon.

## Acknowledgements

This project was inspired by Mozilla's
[multi-account-containers](https://github.com/mozilla/multi-account-containers)
project.
