import {IslandManager} from "./IslandManager"
import {IslandRouter} from "./IslandRouter"

const main = async () => {
    await IslandManager.shared.attach()
    console.log("mappings: ", IslandManager.shared.mappings())

    IslandRouter.shared.attach()
}

main()
