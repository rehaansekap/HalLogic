import TeacherDashboardController from './TeacherDashboardController'
import TeacherMissionController from './TeacherMissionController'

const Teacher = {
    TeacherDashboardController: Object.assign(TeacherDashboardController, TeacherDashboardController),
    TeacherMissionController: Object.assign(TeacherMissionController, TeacherMissionController),
}

export default Teacher