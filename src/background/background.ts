import {SettingsManager} from "./SettingsManager"
import {IslandRouter} from "./IslandRouter"

const main = async () => {
  await SettingsManager.shared.attach()

  IslandRouter.shared.attach()
}

main()
