import {RequestListener} from "./RequestListener"
import {StorageManager} from "./StorageManager"

StorageManager.shared
    .attach()
    .then(() => {
        console.log("mappings:")
        console.log(StorageManager.shared.mappings())
    })
    .then(() => {
        return new Promise((resolve) => {
            RequestListener.shared.attach()
            resolve()
        })
    })
