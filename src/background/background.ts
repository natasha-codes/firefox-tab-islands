import {IslandManager} from "./IslandManager"
import {IslandRouter} from "./IslandRouter"

const main = async () => {
  await IslandManager.shared.attach()

  IslandRouter.shared.attach()
}

main()
