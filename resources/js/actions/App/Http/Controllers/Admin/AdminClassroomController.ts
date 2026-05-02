import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::index
* @see app/Http/Controllers/Admin/AdminClassroomController.php:26
* @route '/admin/classrooms'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/classrooms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::index
* @see app/Http/Controllers/Admin/AdminClassroomController.php:26
* @route '/admin/classrooms'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::index
* @see app/Http/Controllers/Admin/AdminClassroomController.php:26
* @route '/admin/classrooms'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::index
* @see app/Http/Controllers/Admin/AdminClassroomController.php:26
* @route '/admin/classrooms'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::index
* @see app/Http/Controllers/Admin/AdminClassroomController.php:26
* @route '/admin/classrooms'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::index
* @see app/Http/Controllers/Admin/AdminClassroomController.php:26
* @route '/admin/classrooms'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::index
* @see app/Http/Controllers/Admin/AdminClassroomController.php:26
* @route '/admin/classrooms'
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

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::create
* @see app/Http/Controllers/Admin/AdminClassroomController.php:51
* @route '/admin/classrooms/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/classrooms/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::create
* @see app/Http/Controllers/Admin/AdminClassroomController.php:51
* @route '/admin/classrooms/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::create
* @see app/Http/Controllers/Admin/AdminClassroomController.php:51
* @route '/admin/classrooms/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::create
* @see app/Http/Controllers/Admin/AdminClassroomController.php:51
* @route '/admin/classrooms/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::create
* @see app/Http/Controllers/Admin/AdminClassroomController.php:51
* @route '/admin/classrooms/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::create
* @see app/Http/Controllers/Admin/AdminClassroomController.php:51
* @route '/admin/classrooms/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::create
* @see app/Http/Controllers/Admin/AdminClassroomController.php:51
* @route '/admin/classrooms/create'
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
* @see \App\Http\Controllers\Admin\AdminClassroomController::store
* @see app/Http/Controllers/Admin/AdminClassroomController.php:63
* @route '/admin/classrooms'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/classrooms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::store
* @see app/Http/Controllers/Admin/AdminClassroomController.php:63
* @route '/admin/classrooms'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::store
* @see app/Http/Controllers/Admin/AdminClassroomController.php:63
* @route '/admin/classrooms'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::store
* @see app/Http/Controllers/Admin/AdminClassroomController.php:63
* @route '/admin/classrooms'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::store
* @see app/Http/Controllers/Admin/AdminClassroomController.php:63
* @route '/admin/classrooms'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::edit
* @see app/Http/Controllers/Admin/AdminClassroomController.php:88
* @route '/admin/classrooms/{classroom}/edit'
*/
export const edit = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/classrooms/{classroom}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::edit
* @see app/Http/Controllers/Admin/AdminClassroomController.php:88
* @route '/admin/classrooms/{classroom}/edit'
*/
edit.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::edit
* @see app/Http/Controllers/Admin/AdminClassroomController.php:88
* @route '/admin/classrooms/{classroom}/edit'
*/
edit.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::edit
* @see app/Http/Controllers/Admin/AdminClassroomController.php:88
* @route '/admin/classrooms/{classroom}/edit'
*/
edit.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::edit
* @see app/Http/Controllers/Admin/AdminClassroomController.php:88
* @route '/admin/classrooms/{classroom}/edit'
*/
const editForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::edit
* @see app/Http/Controllers/Admin/AdminClassroomController.php:88
* @route '/admin/classrooms/{classroom}/edit'
*/
editForm.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::edit
* @see app/Http/Controllers/Admin/AdminClassroomController.php:88
* @route '/admin/classrooms/{classroom}/edit'
*/
editForm.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:108
* @route '/admin/classrooms/{classroom}'
*/
export const update = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/classrooms/{classroom}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:108
* @route '/admin/classrooms/{classroom}'
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
* @see app/Http/Controllers/Admin/AdminClassroomController.php:108
* @route '/admin/classrooms/{classroom}'
*/
update.put = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:108
* @route '/admin/classrooms/{classroom}'
*/
const updateForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::update
* @see app/Http/Controllers/Admin/AdminClassroomController.php:108
* @route '/admin/classrooms/{classroom}'
*/
updateForm.put = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::destroy
* @see app/Http/Controllers/Admin/AdminClassroomController.php:133
* @route '/admin/classrooms/{classroom}'
*/
export const destroy = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/classrooms/{classroom}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::destroy
* @see app/Http/Controllers/Admin/AdminClassroomController.php:133
* @route '/admin/classrooms/{classroom}'
*/
destroy.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::destroy
* @see app/Http/Controllers/Admin/AdminClassroomController.php:133
* @route '/admin/classrooms/{classroom}'
*/
destroy.delete = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::destroy
* @see app/Http/Controllers/Admin/AdminClassroomController.php:133
* @route '/admin/classrooms/{classroom}'
*/
const destroyForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::destroy
* @see app/Http/Controllers/Admin/AdminClassroomController.php:133
* @route '/admin/classrooms/{classroom}'
*/
destroyForm.delete = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\AdminClassroomController::manageStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
export const manageStudents = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageStudents.url(args, options),
    method: 'get',
})

manageStudents.definition = {
    methods: ["get","head"],
    url: '/admin/classrooms/{classroom}/students',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manageStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manageStudents.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return manageStudents.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manageStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manageStudents.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageStudents.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manageStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manageStudents.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageStudents.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manageStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
const manageStudentsForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageStudents.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manageStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manageStudentsForm.get = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageStudents.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::manageStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:157
* @route '/admin/classrooms/{classroom}/students'
*/
manageStudentsForm.head = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageStudents.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manageStudents.form = manageStudentsForm

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::updateStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
export const updateStudents = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStudents.url(args, options),
    method: 'post',
})

updateStudents.definition = {
    methods: ["post"],
    url: '/admin/classrooms/{classroom}/students',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::updateStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
updateStudents.url = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateStudents.definition.url
            .replace('{classroom}', parsedArgs.classroom.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::updateStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
updateStudents.post = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStudents.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::updateStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
const updateStudentsForm = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStudents.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminClassroomController::updateStudents
* @see app/Http/Controllers/Admin/AdminClassroomController.php:179
* @route '/admin/classrooms/{classroom}/students'
*/
updateStudentsForm.post = (args: { classroom: number | { id: number } } | [classroom: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStudents.url(args, options),
    method: 'post',
})

updateStudents.form = updateStudentsForm

const AdminClassroomController = { index, create, store, edit, update, destroy, manageStudents, updateStudents }

export default AdminClassroomController