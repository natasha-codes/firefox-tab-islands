# firefox-islands

A config-based wrapper around Firefox's [contextualidentities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_contextual_identities) API

## island rules

island == contextual identity (aka tab group, container, etc.)

1. URLs may belong to an island.
2. If a URL belongs to an island it will always open in that island.
3. If a URL does not belong to an island it will open in the mainland (aka the default island).
