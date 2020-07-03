# firefox-tab-islands

A config-file-based wrapper around Firefox's [contextualidentities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_contextual_identities) API.

This project was inspired by the `multi-account-containers` project, but designed to be strict by default and portable via a config file.

## island rules

island == contextual identity (aka tab group, container, etc.)

1. URLs may belong to an island.
2. If a URL belongs to an island it will always open in that island.
3. If a URL does not belong to an island it will open in the mainland (aka the default island).

## building and developing

```shell
$ yarn install # or `npm`
$ yarn build
```

Follow [Mozilla's official steps](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Trying_it_out) to install/debug a temporary addon.
