import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::index
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::index
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherDashboardController::index
* @see app/Http/Controllers/Teacher/TeacherDashboardController.php:23
* @route '/teacher/dashboard'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const TeacherDashboardController = { index }

export default TeacherDashboardController