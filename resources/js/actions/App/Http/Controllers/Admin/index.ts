import AdminDashboardController from './AdminDashboardController'
import AdminUserController from './AdminUserController'
import AdminClassroomController from './AdminClassroomController'

const Admin = {
    AdminDashboardController: Object.assign(AdminDashboardController, AdminDashboardController),
    AdminUserController: Object.assign(AdminUserController, AdminUserController),
    AdminClassroomController: Object.assign(AdminClassroomController, AdminClassroomController),
}

export default Admin