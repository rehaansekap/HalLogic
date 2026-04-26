import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::create
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:77
* @route '/teacher/mission/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/teacher/mission/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::create
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:77
* @route '/teacher/mission/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::create
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:77
* @route '/teacher/mission/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::create
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:77
* @route '/teacher/mission/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::create
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:77
* @route '/teacher/mission/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::create
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:77
* @route '/teacher/mission/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::create
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:77
* @route '/teacher/mission/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::store
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:99
* @route '/teacher/mission'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teacher/mission',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::store
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:99
* @route '/teacher/mission'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::store
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:99
* @route '/teacher/mission'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::store
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:99
* @route '/teacher/mission'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::store
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:99
* @route '/teacher/mission'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::edit
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:126
* @route '/teacher/mission/{slug}/edit'
*/
export const edit = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/teacher/mission/{slug}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::edit
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:126
* @route '/teacher/mission/{slug}/edit'
*/
edit.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::edit
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:126
* @route '/teacher/mission/{slug}/edit'
*/
edit.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::edit
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:126
* @route '/teacher/mission/{slug}/edit'
*/
edit.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::edit
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:126
* @route '/teacher/mission/{slug}/edit'
*/
const editForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::edit
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:126
* @route '/teacher/mission/{slug}/edit'
*/
editForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::edit
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:126
* @route '/teacher/mission/{slug}/edit'
*/
editForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::update
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:172
* @route '/teacher/mission/{mission}/update'
*/
export const update = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/teacher/mission/{mission}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::update
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:172
* @route '/teacher/mission/{mission}/update'
*/
update.url = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { mission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            mission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mission: typeof args.mission === 'object'
        ? args.mission.id
        : args.mission,
    }

    return update.definition.url
            .replace('{mission}', parsedArgs.mission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::update
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:172
* @route '/teacher/mission/{mission}/update'
*/
update.post = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::update
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:172
* @route '/teacher/mission/{mission}/update'
*/
const updateForm = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::update
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:172
* @route '/teacher/mission/{mission}/update'
*/
updateForm.post = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::destroy
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:203
* @route '/teacher/mission/{mission}'
*/
export const destroy = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teacher/mission/{mission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::destroy
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:203
* @route '/teacher/mission/{mission}'
*/
destroy.url = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { mission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            mission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        mission: typeof args.mission === 'object'
        ? args.mission.id
        : args.mission,
    }

    return destroy.definition.url
            .replace('{mission}', parsedArgs.mission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::destroy
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:203
* @route '/teacher/mission/{mission}'
*/
destroy.delete = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::destroy
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:203
* @route '/teacher/mission/{mission}'
*/
const destroyForm = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::destroy
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:203
* @route '/teacher/mission/{mission}'
*/
destroyForm.delete = (args: { mission: string | number | { id: string | number } } | [mission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

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
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
export const saveAttendance = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAttendance.url(args, options),
    method: 'post',
})

saveAttendance.definition = {
    methods: ["post"],
    url: '/teacher/mission/{mission}/attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
saveAttendance.url = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return saveAttendance.definition.url
            .replace('{mission}', parsedArgs.mission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
saveAttendance.post = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAttendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
const saveAttendanceForm = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveAttendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:266
* @route '/teacher/mission/{mission}/attendance'
*/
saveAttendanceForm.post = (args: { mission: string | number } | [mission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveAttendance.url(args, options),
    method: 'post',
})

saveAttendance.form = saveAttendanceForm

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

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:233
* @route '/teacher/submission/{submission}/grade'
*/
export const saveGrade = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveGrade.url(args, options),
    method: 'post',
})

saveGrade.definition = {
    methods: ["post"],
    url: '/teacher/submission/{submission}/grade',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:233
* @route '/teacher/submission/{submission}/grade'
*/
saveGrade.url = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { submission: args }
    }

    if (Array.isArray(args)) {
        args = {
            submission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        submission: args.submission,
    }

    return saveGrade.definition.url
            .replace('{submission}', parsedArgs.submission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:233
* @route '/teacher/submission/{submission}/grade'
*/
saveGrade.post = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveGrade.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:233
* @route '/teacher/submission/{submission}/grade'
*/
const saveGradeForm = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveGrade.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMissionController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMissionController.php:233
* @route '/teacher/submission/{submission}/grade'
*/
saveGradeForm.post = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveGrade.url(args, options),
    method: 'post',
})

saveGrade.form = saveGradeForm

const TeacherMissionController = { create, store, edit, update, destroy, show, saveAttendance, updateGroups, saveGrade }

export default TeacherMissionController