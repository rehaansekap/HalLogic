import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
export const manage = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
manage.url = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
manage.get = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manage.head = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
const manageForm = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manageForm.get = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manage
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manageForm.head = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manage.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manage.form = manageForm

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
export const update = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
update.url = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
update.post = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
const updateForm = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
updateForm.post = (args: { classroom: string | number | { id: string | number } } | [classroom: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

const students = {
    manage: Object.assign(manage, manage),
    update: Object.assign(update, update),
}

export default students