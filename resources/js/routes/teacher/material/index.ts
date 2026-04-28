import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::show
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:46
* @route '/teacher/material/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/teacher/material/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::show
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:46
* @route '/teacher/material/{slug}'
*/
show.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::show
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:46
* @route '/teacher/material/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::show
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:46
* @route '/teacher/material/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::show
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:46
* @route '/teacher/material/{slug}'
*/
const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::show
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:46
* @route '/teacher/material/{slug}'
*/
showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::show
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:46
* @route '/teacher/material/{slug}'
*/
showForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::attendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:265
* @route '/teacher/material/{material}/attendance'
*/
export const attendance = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attendance.url(args, options),
    method: 'post',
})

attendance.definition = {
    methods: ["post"],
    url: '/teacher/material/{material}/attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::attendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:265
* @route '/teacher/material/{material}/attendance'
*/
attendance.url = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { material: args }
    }

    if (Array.isArray(args)) {
        args = {
            material: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        material: args.material,
    }

    return attendance.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::attendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:265
* @route '/teacher/material/{material}/attendance'
*/
attendance.post = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::attendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:265
* @route '/teacher/material/{material}/attendance'
*/
const attendanceForm = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::attendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:265
* @route '/teacher/material/{material}/attendance'
*/
attendanceForm.post = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attendance.url(args, options),
    method: 'post',
})

attendance.form = attendanceForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:295
* @route '/teacher/material/{material}/update-groups'
*/
export const updateGroups = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateGroups.url(args, options),
    method: 'post',
})

updateGroups.definition = {
    methods: ["post"],
    url: '/teacher/material/{material}/update-groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:295
* @route '/teacher/material/{material}/update-groups'
*/
updateGroups.url = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { material: args }
    }

    if (Array.isArray(args)) {
        args = {
            material: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        material: args.material,
    }

    return updateGroups.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:295
* @route '/teacher/material/{material}/update-groups'
*/
updateGroups.post = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateGroups.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:295
* @route '/teacher/material/{material}/update-groups'
*/
const updateGroupsForm = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateGroups.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:295
* @route '/teacher/material/{material}/update-groups'
*/
updateGroupsForm.post = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateGroups.url(args, options),
    method: 'post',
})

updateGroups.form = updateGroupsForm

const material = {
    show: Object.assign(show, show),
    attendance: Object.assign(attendance, attendance),
    updateGroups: Object.assign(updateGroups, updateGroups),
}

export default material