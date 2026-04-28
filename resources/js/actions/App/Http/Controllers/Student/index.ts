import DashboardController from './DashboardController'
import MaterialController from './MaterialController'

const Student = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    MaterialController: Object.assign(MaterialController, MaterialController),
}

export default Student