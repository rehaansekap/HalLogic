import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
export const manage = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(args, options),
    method: 'get',
})

manage.definition = {
    methods: ["get","head"],
    url: '/admin/classrooms/{classroom}/students',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manage.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classroom: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { classroom: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            classroom: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        classroom: typeof args.classroom === 'object'
        ? args.classroom.id
        : args.classroom,
    }

    return manage.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manage.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manage.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
export const update = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/classrooms/{classroom}/students',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
update.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classroom: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { classroom: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            classroom: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        classroom: typeof args.classroom === 'object'
        ? args.classroom.id
        : args.classroom,
    }

    return update.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
update.post = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

const students = {
    manage: Object.assign(manage, manage),
    update: Object.assign(update, update),
}

export default students