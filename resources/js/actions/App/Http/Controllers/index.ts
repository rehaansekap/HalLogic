import Student from './Student'
import Teacher from './Teacher'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    Student: Object.assign(Student, Student),
    Teacher: Object.assign(Teacher, Teacher),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers