import TeacherDashboardController from './TeacherDashboardController'
import TeacherMaterialController from './TeacherMaterialController'

const Teacher = {
    TeacherDashboardController: Object.assign(TeacherDashboardController, TeacherDashboardController),
    TeacherMaterialController: Object.assign(TeacherMaterialController, TeacherMaterialController),
}

export default Teacher