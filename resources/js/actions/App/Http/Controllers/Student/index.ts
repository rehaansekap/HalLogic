import DashboardController from './DashboardController'
import MissionController from './MissionController'

const Student = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    MissionController: Object.assign(MissionController, MissionController),
}

export default Student