import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Student\MaterialController::submitReflection
* @see app/Http/Controllers/Student/MaterialController.php:82
* @route '/material/{slug}/reflection'
*/
export const submitReflection = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitReflection.url(args, options),
    method: 'post',
})

submitReflection.definition = {
    methods: ["post"],
    url: '/material/{slug}/reflection',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::submitReflection
* @see app/Http/Controllers/Student/MaterialController.php:82
* @route '/material/{slug}/reflection'
*/
submitReflection.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return submitReflection.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::submitReflection
* @see app/Http/Controllers/Student/MaterialController.php:82
* @route '/material/{slug}/reflection'
*/
submitReflection.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitReflection.url(args, options),
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
* @see \App\Http\Controllers\Student\MaterialController::submitFinalReflection
* @see app/Http/Controllers/Student/MaterialController.php:138
* @route '/material/{slug}/finish'
*/
export const submitFinalReflection = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitFinalReflection.url(args, options),
    method: 'post',
})

submitFinalReflection.definition = {
    methods: ["post"],
    url: '/material/{slug}/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFinalReflection
* @see app/Http/Controllers/Student/MaterialController.php:138
* @route '/material/{slug}/finish'
*/
submitFinalReflection.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return submitFinalReflection.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFinalReflection
* @see app/Http/Controllers/Student/MaterialController.php:138
* @route '/material/{slug}/finish'
*/
submitFinalReflection.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitFinalReflection.url(args, options),
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

const MaterialController = { show, submitReflection, savePhase3, submitFinalReflection, runCode }

export default MaterialController