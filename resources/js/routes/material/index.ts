import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:36
* @route '/material/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/material/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:36
* @route '/material/{slug}'
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
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:36
* @route '/material/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:36
* @route '/material/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::reflection
* @see app/Http/Controllers/Student/MaterialController.php:82
* @route '/material/{slug}/reflection'
*/
export const reflection = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reflection.url(args, options),
    method: 'post',
})

reflection.definition = {
    methods: ["post"],
    url: '/material/{slug}/reflection',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::reflection
* @see app/Http/Controllers/Student/MaterialController.php:82
* @route '/material/{slug}/reflection'
*/
reflection.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return reflection.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::reflection
* @see app/Http/Controllers/Student/MaterialController.php:82
* @route '/material/{slug}/reflection'
*/
reflection.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reflection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::savePhase3
* @see app/Http/Controllers/Student/MaterialController.php:105
* @route '/material/{slug}/save-phase-3'
*/
export const savePhase3 = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: savePhase3.url(args, options),
    method: 'post',
})

savePhase3.definition = {
    methods: ["post"],
    url: '/material/{slug}/save-phase-3',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::savePhase3
* @see app/Http/Controllers/Student/MaterialController.php:105
* @route '/material/{slug}/save-phase-3'
*/
savePhase3.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return savePhase3.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::savePhase3
* @see app/Http/Controllers/Student/MaterialController.php:105
* @route '/material/{slug}/save-phase-3'
*/
savePhase3.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: savePhase3.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::finish
* @see app/Http/Controllers/Student/MaterialController.php:138
* @route '/material/{slug}/finish'
*/
export const finish = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

finish.definition = {
    methods: ["post"],
    url: '/material/{slug}/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::finish
* @see app/Http/Controllers/Student/MaterialController.php:138
* @route '/material/{slug}/finish'
*/
finish.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return finish.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::finish
* @see app/Http/Controllers/Student/MaterialController.php:138
* @route '/material/{slug}/finish'
*/
finish.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::runCode
* @see app/Http/Controllers/Student/MaterialController.php:176
* @route '/material/{slug}/run-code'
*/
export const runCode = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runCode.url(args, options),
    method: 'post',
})

runCode.definition = {
    methods: ["post"],
    url: '/material/{slug}/run-code',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::runCode
* @see app/Http/Controllers/Student/MaterialController.php:176
* @route '/material/{slug}/run-code'
*/
runCode.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return runCode.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::runCode
* @see app/Http/Controllers/Student/MaterialController.php:176
* @route '/material/{slug}/run-code'
*/
runCode.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runCode.url(args, options),
    method: 'post',
})

const material = {
    show: Object.assign(show, show),
    reflection: Object.assign(reflection, reflection),
    savePhase3: Object.assign(savePhase3, savePhase3),
    finish: Object.assign(finish, finish),
    runCode: Object.assign(runCode, runCode),
}

export default material