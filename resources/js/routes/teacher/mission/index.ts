import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::show
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:43
* @route '/teacher/mission/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/teacher/mission/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::show
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:43
* @route '/teacher/mission/{slug}'
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
* @see \App\Http\Controllers\Teacher\TeacherMissionController::show
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:43
* @route '/teacher/mission/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::show
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:43
* @route '/teacher/mission/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::show
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:43
* @route '/teacher/mission/{slug}'
*/
const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::show
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:43
* @route '/teacher/mission/{slug}'
*/
showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::show
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:43
* @route '/teacher/mission/{slug}'
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
* @see \App\Http\Controllers\Teacher\TeacherMissionController::attendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
export const attendance = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attendance.url(args, options),
    method: 'post',
})

attendance.definition = {
    methods: ["post"],
    url: '/teacher/mission/{mission}/attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::attendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
attendance.url = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mission: args }
    }

    if (Array.isArray(args)) {
        args = {
            mission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mission: args.mission,
    }

    return attendance.definition.url
            .replace('{mission}', parsedArgs.mission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::attendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
attendance.post = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::attendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
const attendanceForm = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::attendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
attendanceForm.post = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attendance.url(args, options),
    method: 'post',
})

attendance.form = attendanceForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:296
* @route '/teacher/mission/{mission}/update-groups'
*/
export const updateGroups = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateGroups.url(args, options),
    method: 'post',
})

updateGroups.definition = {
    methods: ["post"],
    url: '/teacher/mission/{mission}/update-groups',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:296
* @route '/teacher/mission/{mission}/update-groups'
*/
updateGroups.url = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mission: args }
    }

    if (Array.isArray(args)) {
        args = {
            mission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mission: args.mission,
    }

    return updateGroups.definition.url
            .replace('{mission}', parsedArgs.mission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:296
* @route '/teacher/mission/{mission}/update-groups'
*/
updateGroups.post = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateGroups.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:296
* @route '/teacher/mission/{mission}/update-groups'
*/
const updateGroupsForm = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateGroups.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:296
* @route '/teacher/mission/{mission}/update-groups'
*/
updateGroupsForm.post = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateGroups.url(args, options),
    method: 'post',
})

updateGroups.form = updateGroupsForm

const mission = {
    show: Object.assign(show, show),
    attendance: Object.assign(attendance, attendance),
    updateGroups: Object.assign(updateGroups, updateGroups),
}

export default mission