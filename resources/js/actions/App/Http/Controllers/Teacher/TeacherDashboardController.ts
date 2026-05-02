import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::index
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/teacher/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::index
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::index
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::index
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const TeacherDashboardController = { index }

export default TeacherDashboardController