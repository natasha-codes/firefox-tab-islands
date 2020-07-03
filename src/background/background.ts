import {RequestListener} from "./RequestListener"
import {StorageManager} from "./StorageManager"

StorageManager.shared
    .getMappings()
    .then((mappings) => {
        console.log("mappings:")
        console.log(mappings)
    })
    .then(() => {
        return new Promise((resolve) => {
            RequestListener.shared.attach()
            resolve()
        })
    })
