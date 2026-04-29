import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:43
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
* @see app/Http/Controllers/Student/MaterialController.php:43
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
* @see app/Http/Controllers/Student/MaterialController.php:43
* @route '/material/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:43
* @route '/material/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:43
* @route '/material/{slug}'
*/
const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:43
* @route '/material/{slug}'
*/
showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::show
* @see app/Http/Controllers/Student/MaterialController.php:43
* @route '/material/{slug}'
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
* @see \App\Http\Controllers\Student\MaterialController::submitReflection
* @see app/Http/Controllers/Student/MaterialController.php:167
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
* @see app/Http/Controllers/Student/MaterialController.php:167
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
* @see app/Http/Controllers/Student/MaterialController.php:167
* @route '/material/{slug}/reflection'
*/
submitReflection.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitReflection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::submitReflection
* @see app/Http/Controllers/Student/MaterialController.php:167
* @route '/material/{slug}/reflection'
*/
const submitReflectionForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitReflection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::submitReflection
* @see app/Http/Controllers/Student/MaterialController.php:167
* @route '/material/{slug}/reflection'
*/
submitReflectionForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitReflection.url(args, options),
    method: 'post',
})

submitReflection.form = submitReflectionForm

/**
* @see \App\Http\Controllers\Student\MaterialController::updateRole
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/update-role'
*/
export const updateRole = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateRole.url(args, options),
    method: 'post',
})

updateRole.definition = {
    methods: ["post"],
    url: '/material/{slug}/update-role',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::updateRole
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/update-role'
*/
updateRole.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateRole.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::updateRole
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/update-role'
*/
updateRole.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::updateRole
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/update-role'
*/
const updateRoleForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::updateRole
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/update-role'
*/
updateRoleForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, options),
    method: 'post',
})

updateRole.form = updateRoleForm

/**
* @see \App\Http\Controllers\Student\MaterialController::completeStep2
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/complete-step-2'
*/
export const completeStep2 = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeStep2.url(args, options),
    method: 'post',
})

completeStep2.definition = {
    methods: ["post"],
    url: '/material/{slug}/complete-step-2',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::completeStep2
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/complete-step-2'
*/
completeStep2.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return completeStep2.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::completeStep2
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/complete-step-2'
*/
completeStep2.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeStep2.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::completeStep2
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/complete-step-2'
*/
const completeStep2Form = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: completeStep2.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::completeStep2
* @see app/Http/Controllers/Student/MaterialController.php:0
* @route '/material/{slug}/complete-step-2'
*/
completeStep2Form.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: completeStep2.url(args, options),
    method: 'post',
})

completeStep2.form = completeStep2Form

/**
* @see \App\Http\Controllers\Student\MaterialController::savePhase3
* @see app/Http/Controllers/Student/MaterialController.php:227
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
* @see app/Http/Controllers/Student/MaterialController.php:227
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
* @see app/Http/Controllers/Student/MaterialController.php:227
* @route '/material/{slug}/save-phase-3'
*/
savePhase3.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: savePhase3.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::savePhase3
* @see app/Http/Controllers/Student/MaterialController.php:227
* @route '/material/{slug}/save-phase-3'
*/
const savePhase3Form = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: savePhase3.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::savePhase3
* @see app/Http/Controllers/Student/MaterialController.php:227
* @route '/material/{slug}/save-phase-3'
*/
savePhase3Form.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: savePhase3.url(args, options),
    method: 'post',
})

savePhase3.form = savePhase3Form

/**
* @see \App\Http\Controllers\Student\MaterialController::submitVote
* @see app/Http/Controllers/Student/MaterialController.php:190
* @route '/material/{slug}/vote'
*/
export const submitVote = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitVote.url(args, options),
    method: 'post',
})

submitVote.definition = {
    methods: ["post"],
    url: '/material/{slug}/vote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::submitVote
* @see app/Http/Controllers/Student/MaterialController.php:190
* @route '/material/{slug}/vote'
*/
submitVote.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return submitVote.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::submitVote
* @see app/Http/Controllers/Student/MaterialController.php:190
* @route '/material/{slug}/vote'
*/
submitVote.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitVote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::submitVote
* @see app/Http/Controllers/Student/MaterialController.php:190
* @route '/material/{slug}/vote'
*/
const submitVoteForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitVote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::submitVote
* @see app/Http/Controllers/Student/MaterialController.php:190
* @route '/material/{slug}/vote'
*/
submitVoteForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitVote.url(args, options),
    method: 'post',
})

submitVote.form = submitVoteForm

/**
* @see \App\Http\Controllers\Student\MaterialController::toggleLike
* @see app/Http/Controllers/Student/MaterialController.php:260
* @route '/submission/{submissionId}/like'
*/
export const toggleLike = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleLike.url(args, options),
    method: 'post',
})

toggleLike.definition = {
    methods: ["post"],
    url: '/submission/{submissionId}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::toggleLike
* @see app/Http/Controllers/Student/MaterialController.php:260
* @route '/submission/{submissionId}/like'
*/
toggleLike.url = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { submissionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            submissionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        submissionId: args.submissionId,
    }

    return toggleLike.definition.url
            .replace('{submissionId}', parsedArgs.submissionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::toggleLike
* @see app/Http/Controllers/Student/MaterialController.php:260
* @route '/submission/{submissionId}/like'
*/
toggleLike.post = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleLike.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::toggleLike
* @see app/Http/Controllers/Student/MaterialController.php:260
* @route '/submission/{submissionId}/like'
*/
const toggleLikeForm = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleLike.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::toggleLike
* @see app/Http/Controllers/Student/MaterialController.php:260
* @route '/submission/{submissionId}/like'
*/
toggleLikeForm.post = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleLike.url(args, options),
    method: 'post',
})

toggleLike.form = toggleLikeForm

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFeedback
* @see app/Http/Controllers/Student/MaterialController.php:279
* @route '/submission/{submissionId}/feedback'
*/
export const submitFeedback = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitFeedback.url(args, options),
    method: 'post',
})

submitFeedback.definition = {
    methods: ["post"],
    url: '/submission/{submissionId}/feedback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFeedback
* @see app/Http/Controllers/Student/MaterialController.php:279
* @route '/submission/{submissionId}/feedback'
*/
submitFeedback.url = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { submissionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            submissionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        submissionId: args.submissionId,
    }

    return submitFeedback.definition.url
            .replace('{submissionId}', parsedArgs.submissionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFeedback
* @see app/Http/Controllers/Student/MaterialController.php:279
* @route '/submission/{submissionId}/feedback'
*/
submitFeedback.post = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitFeedback.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFeedback
* @see app/Http/Controllers/Student/MaterialController.php:279
* @route '/submission/{submissionId}/feedback'
*/
const submitFeedbackForm = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitFeedback.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFeedback
* @see app/Http/Controllers/Student/MaterialController.php:279
* @route '/submission/{submissionId}/feedback'
*/
submitFeedbackForm.post = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitFeedback.url(args, options),
    method: 'post',
})

submitFeedback.form = submitFeedbackForm

/**
* @see \App\Http\Controllers\Student\MaterialController::getFeedbacks
* @see app/Http/Controllers/Student/MaterialController.php:300
* @route '/submission/{submissionId}/feedbacks'
*/
export const getFeedbacks = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFeedbacks.url(args, options),
    method: 'get',
})

getFeedbacks.definition = {
    methods: ["get","head"],
    url: '/submission/{submissionId}/feedbacks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\MaterialController::getFeedbacks
* @see app/Http/Controllers/Student/MaterialController.php:300
* @route '/submission/{submissionId}/feedbacks'
*/
getFeedbacks.url = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { submissionId: args }
    }

    if (Array.isArray(args)) {
        args = {
            submissionId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        submissionId: args.submissionId,
    }

    return getFeedbacks.definition.url
            .replace('{submissionId}', parsedArgs.submissionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MaterialController::getFeedbacks
* @see app/Http/Controllers/Student/MaterialController.php:300
* @route '/submission/{submissionId}/feedbacks'
*/
getFeedbacks.get = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFeedbacks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::getFeedbacks
* @see app/Http/Controllers/Student/MaterialController.php:300
* @route '/submission/{submissionId}/feedbacks'
*/
getFeedbacks.head = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFeedbacks.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::getFeedbacks
* @see app/Http/Controllers/Student/MaterialController.php:300
* @route '/submission/{submissionId}/feedbacks'
*/
const getFeedbacksForm = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFeedbacks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::getFeedbacks
* @see app/Http/Controllers/Student/MaterialController.php:300
* @route '/submission/{submissionId}/feedbacks'
*/
getFeedbacksForm.get = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFeedbacks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::getFeedbacks
* @see app/Http/Controllers/Student/MaterialController.php:300
* @route '/submission/{submissionId}/feedbacks'
*/
getFeedbacksForm.head = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFeedbacks.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getFeedbacks.form = getFeedbacksForm

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFinalReflection
* @see app/Http/Controllers/Student/MaterialController.php:307
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
* @see app/Http/Controllers/Student/MaterialController.php:307
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
* @see app/Http/Controllers/Student/MaterialController.php:307
* @route '/material/{slug}/finish'
*/
submitFinalReflection.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitFinalReflection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFinalReflection
* @see app/Http/Controllers/Student/MaterialController.php:307
* @route '/material/{slug}/finish'
*/
const submitFinalReflectionForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitFinalReflection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::submitFinalReflection
* @see app/Http/Controllers/Student/MaterialController.php:307
* @route '/material/{slug}/finish'
*/
submitFinalReflectionForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitFinalReflection.url(args, options),
    method: 'post',
})

submitFinalReflection.form = submitFinalReflectionForm

/**
* @see \App\Http\Controllers\Student\MaterialController::runCode
* @see app/Http/Controllers/Student/MaterialController.php:345
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
* @see app/Http/Controllers/Student/MaterialController.php:345
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
* @see app/Http/Controllers/Student/MaterialController.php:345
* @route '/material/{slug}/run-code'
*/
runCode.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runCode.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::runCode
* @see app/Http/Controllers/Student/MaterialController.php:345
* @route '/material/{slug}/run-code'
*/
const runCodeForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: runCode.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MaterialController::runCode
* @see app/Http/Controllers/Student/MaterialController.php:345
* @route '/material/{slug}/run-code'
*/
runCodeForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: runCode.url(args, options),
    method: 'post',
})

runCode.form = runCodeForm

const MaterialController = { show, submitReflection, updateRole, completeStep2, savePhase3, submitVote, toggleLike, submitFeedback, getFeedbacks, submitFinalReflection, runCode }

export default MaterialController