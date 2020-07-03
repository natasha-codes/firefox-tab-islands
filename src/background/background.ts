import {StorageManager} from "./StorageManager"
import {IslandRouter} from "./IslandRouter"

const main = async () => {
    await StorageManager.shared.attach()
    console.log(StorageManager.shared.mappings())

    IslandRouter.shared.attach()
}

main()
