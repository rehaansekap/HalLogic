import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::create
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:81
* @route '/teacher/material/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/teacher/material/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::create
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:81
* @route '/teacher/material/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::create
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:81
* @route '/teacher/material/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::create
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:81
* @route '/teacher/material/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::create
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:81
* @route '/teacher/material/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::create
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:81
* @route '/teacher/material/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::create
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:81
* @route '/teacher/material/create'
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
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::store
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:106
* @route '/teacher/material'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/teacher/material',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::store
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:106
* @route '/teacher/material'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::store
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:106
* @route '/teacher/material'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::store
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:106
* @route '/teacher/material'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::store
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:106
* @route '/teacher/material'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::edit
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:133
* @route '/teacher/material/{slug}/edit'
*/
export const edit = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/teacher/material/{slug}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::edit
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:133
* @route '/teacher/material/{slug}/edit'
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
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::edit
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:133
* @route '/teacher/material/{slug}/edit'
*/
edit.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::edit
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:133
* @route '/teacher/material/{slug}/edit'
*/
edit.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::edit
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:133
* @route '/teacher/material/{slug}/edit'
*/
const editForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::edit
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:133
* @route '/teacher/material/{slug}/edit'
*/
editForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::edit
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:133
* @route '/teacher/material/{slug}/edit'
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
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::update
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:182
* @route '/teacher/material/{material}/update'
*/
export const update = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/teacher/material/{material}/update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::update
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:182
* @route '/teacher/material/{material}/update'
*/
update.url = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { material: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { material: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            material: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        material: typeof args.material === 'object'
        ? args.material.id
        : args.material,
    }

    return update.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::update
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:182
* @route '/teacher/material/{material}/update'
*/
update.post = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::update
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:182
* @route '/teacher/material/{material}/update'
*/
const updateForm = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::update
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:182
* @route '/teacher/material/{material}/update'
*/
updateForm.post = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, options),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::destroy
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:213
* @route '/teacher/material/{material}'
*/
export const destroy = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/teacher/material/{material}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::destroy
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:213
* @route '/teacher/material/{material}'
*/
destroy.url = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { material: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { material: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            material: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        material: typeof args.material === 'object'
        ? args.material.id
        : args.material,
    }

    return destroy.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::destroy
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:213
* @route '/teacher/material/{material}'
*/
destroy.delete = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::destroy
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:213
* @route '/teacher/material/{material}'
*/
const destroyForm = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::destroy
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:213
* @route '/teacher/material/{material}'
*/
destroyForm.delete = (args: { material: number | { id: number } } | [material: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:276
* @route '/teacher/material/{material}/attendance'
*/
export const saveAttendance = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAttendance.url(args, options),
    method: 'post',
})

saveAttendance.definition = {
    methods: ["post"],
    url: '/teacher/material/{material}/attendance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:276
* @route '/teacher/material/{material}/attendance'
*/
saveAttendance.url = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return saveAttendance.definition.url
            .replace('{material}', parsedArgs.material.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:276
* @route '/teacher/material/{material}/attendance'
*/
saveAttendance.post = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAttendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:276
* @route '/teacher/material/{material}/attendance'
*/
const saveAttendanceForm = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveAttendance.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveAttendance
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:276
* @route '/teacher/material/{material}/attendance'
*/
saveAttendanceForm.post = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveAttendance.url(args, options),
    method: 'post',
})

saveAttendance.form = saveAttendanceForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:306
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
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:306
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
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:306
* @route '/teacher/material/{material}/update-groups'
*/
updateGroups.post = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateGroups.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:306
* @route '/teacher/material/{material}/update-groups'
*/
const updateGroupsForm = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateGroups.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::updateGroups
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:306
* @route '/teacher/material/{material}/update-groups'
*/
updateGroupsForm.post = (args: { material: string | number } | [material: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateGroups.url(args, options),
    method: 'post',
})

updateGroups.form = updateGroupsForm

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:243
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
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:243
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
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:243
* @route '/teacher/submission/{submission}/grade'
*/
saveGrade.post = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveGrade.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:243
* @route '/teacher/submission/{submission}/grade'
*/
const saveGradeForm = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveGrade.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::saveGrade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:243
* @route '/teacher/submission/{submission}/grade'
*/
saveGradeForm.post = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveGrade.url(args, options),
    method: 'post',
})

saveGrade.form = saveGradeForm

const TeacherMaterialController = { create, store, edit, update, destroy, show, saveAttendance, updateGroups, saveGrade }

export default TeacherMaterialController