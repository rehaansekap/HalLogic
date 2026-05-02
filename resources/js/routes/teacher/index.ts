import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import materials from './materials'
import material from './material'
import submission from './submission'
/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::dashboard
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/teacher/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::dashboard
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::dashboard
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::dashboard
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

const teacher = {
    dashboard: Object.assign(dashboard, dashboard),
    materials: Object.assign(materials, materials),
    material: Object.assign(material, material),
    submission: Object.assign(submission, submission),
}

export default teacher