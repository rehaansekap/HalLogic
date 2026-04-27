import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Student\MissionController::show
* @see app/Http/Controllers/Student/MissionController.php:44
* @route '/mission/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mission/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Student\MissionController::show
* @see app/Http/Controllers/Student/MissionController.php:44
* @route '/mission/{slug}'
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
* @see \App\Http\Controllers\Student\MissionController::show
* @see app/Http/Controllers/Student/MissionController.php:44
* @route '/mission/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MissionController::show
* @see app/Http/Controllers/Student/MissionController.php:44
* @route '/mission/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\MissionController::show
* @see app/Http/Controllers/Student/MissionController.php:44
* @route '/mission/{slug}'
*/
const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MissionController::show
* @see app/Http/Controllers/Student/MissionController.php:44
* @route '/mission/{slug}'
*/
showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MissionController::show
* @see app/Http/Controllers/Student/MissionController.php:44
* @route '/mission/{slug}'
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
* @see \App\Http\Controllers\Student\MissionController::reflection
* @see app/Http/Controllers/Student/MissionController.php:175
* @route '/mission/{slug}/reflection'
*/
export const reflection = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reflection.url(args, options),
    method: 'post',
})

reflection.definition = {
    methods: ["post"],
    url: '/mission/{slug}/reflection',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::reflection
* @see app/Http/Controllers/Student/MissionController.php:175
* @route '/mission/{slug}/reflection'
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
* @see \App\Http\Controllers\Student\MissionController::reflection
* @see app/Http/Controllers/Student/MissionController.php:175
* @route '/mission/{slug}/reflection'
*/
reflection.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reflection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::reflection
* @see app/Http/Controllers/Student/MissionController.php:175
* @route '/mission/{slug}/reflection'
*/
const reflectionForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reflection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::reflection
* @see app/Http/Controllers/Student/MissionController.php:175
* @route '/mission/{slug}/reflection'
*/
reflectionForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reflection.url(args, options),
    method: 'post',
})

reflection.form = reflectionForm

/**
* @see \App\Http\Controllers\Student\MissionController::updateRole
* @see app/Http/Controllers/Student/MissionController.php:239
* @route '/mission/{slug}/update-role'
*/
export const updateRole = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateRole.url(args, options),
    method: 'post',
})

updateRole.definition = {
    methods: ["post"],
    url: '/mission/{slug}/update-role',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::updateRole
* @see app/Http/Controllers/Student/MissionController.php:239
* @route '/mission/{slug}/update-role'
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
* @see \App\Http\Controllers\Student\MissionController::updateRole
* @see app/Http/Controllers/Student/MissionController.php:239
* @route '/mission/{slug}/update-role'
*/
updateRole.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::updateRole
* @see app/Http/Controllers/Student/MissionController.php:239
* @route '/mission/{slug}/update-role'
*/
const updateRoleForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::updateRole
* @see app/Http/Controllers/Student/MissionController.php:239
* @route '/mission/{slug}/update-role'
*/
updateRoleForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, options),
    method: 'post',
})

updateRole.form = updateRoleForm

/**
* @see \App\Http\Controllers\Student\MissionController::completeStep2
* @see app/Http/Controllers/Student/MissionController.php:272
* @route '/mission/{slug}/complete-step-2'
*/
export const completeStep2 = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeStep2.url(args, options),
    method: 'post',
})

completeStep2.definition = {
    methods: ["post"],
    url: '/mission/{slug}/complete-step-2',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::completeStep2
* @see app/Http/Controllers/Student/MissionController.php:272
* @route '/mission/{slug}/complete-step-2'
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
* @see \App\Http\Controllers\Student\MissionController::completeStep2
* @see app/Http/Controllers/Student/MissionController.php:272
* @route '/mission/{slug}/complete-step-2'
*/
completeStep2.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeStep2.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::completeStep2
* @see app/Http/Controllers/Student/MissionController.php:272
* @route '/mission/{slug}/complete-step-2'
*/
const completeStep2Form = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: completeStep2.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::completeStep2
* @see app/Http/Controllers/Student/MissionController.php:272
* @route '/mission/{slug}/complete-step-2'
*/
completeStep2Form.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: completeStep2.url(args, options),
    method: 'post',
})

completeStep2.form = completeStep2Form

/**
* @see \App\Http\Controllers\Student\MissionController::savePhase3
* @see app/Http/Controllers/Student/MissionController.php:287
* @route '/mission/{slug}/save-phase-3'
*/
export const savePhase3 = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: savePhase3.url(args, options),
    method: 'post',
})

savePhase3.definition = {
    methods: ["post"],
    url: '/mission/{slug}/save-phase-3',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::savePhase3
* @see app/Http/Controllers/Student/MissionController.php:287
* @route '/mission/{slug}/save-phase-3'
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
* @see \App\Http\Controllers\Student\MissionController::savePhase3
* @see app/Http/Controllers/Student/MissionController.php:287
* @route '/mission/{slug}/save-phase-3'
*/
savePhase3.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: savePhase3.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::savePhase3
* @see app/Http/Controllers/Student/MissionController.php:287
* @route '/mission/{slug}/save-phase-3'
*/
const savePhase3Form = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: savePhase3.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::savePhase3
* @see app/Http/Controllers/Student/MissionController.php:287
* @route '/mission/{slug}/save-phase-3'
*/
savePhase3Form.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: savePhase3.url(args, options),
    method: 'post',
})

savePhase3.form = savePhase3Form

/**
* @see \App\Http\Controllers\Student\MissionController::submitPhase4
* @see app/Http/Controllers/Student/MissionController.php:307
* @route '/mission/{slug}/submit-phase-4'
*/
export const submitPhase4 = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitPhase4.url(args, options),
    method: 'post',
})

submitPhase4.definition = {
    methods: ["post"],
    url: '/mission/{slug}/submit-phase-4',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::submitPhase4
* @see app/Http/Controllers/Student/MissionController.php:307
* @route '/mission/{slug}/submit-phase-4'
*/
submitPhase4.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return submitPhase4.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MissionController::submitPhase4
* @see app/Http/Controllers/Student/MissionController.php:307
* @route '/mission/{slug}/submit-phase-4'
*/
submitPhase4.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitPhase4.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::submitPhase4
* @see app/Http/Controllers/Student/MissionController.php:307
* @route '/mission/{slug}/submit-phase-4'
*/
const submitPhase4Form = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitPhase4.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::submitPhase4
* @see app/Http/Controllers/Student/MissionController.php:307
* @route '/mission/{slug}/submit-phase-4'
*/
submitPhase4Form.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitPhase4.url(args, options),
    method: 'post',
})

submitPhase4.form = submitPhase4Form

/**
* @see \App\Http\Controllers\Student\MissionController::vote
* @see app/Http/Controllers/Student/MissionController.php:198
* @route '/mission/{slug}/vote'
*/
export const vote = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vote.url(args, options),
    method: 'post',
})

vote.definition = {
    methods: ["post"],
    url: '/mission/{slug}/vote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::vote
* @see app/Http/Controllers/Student/MissionController.php:198
* @route '/mission/{slug}/vote'
*/
vote.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return vote.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MissionController::vote
* @see app/Http/Controllers/Student/MissionController.php:198
* @route '/mission/{slug}/vote'
*/
vote.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::vote
* @see app/Http/Controllers/Student/MissionController.php:198
* @route '/mission/{slug}/vote'
*/
const voteForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: vote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::vote
* @see app/Http/Controllers/Student/MissionController.php:198
* @route '/mission/{slug}/vote'
*/
voteForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: vote.url(args, options),
    method: 'post',
})

vote.form = voteForm

/**
* @see \App\Http\Controllers\Student\MissionController::like
* @see app/Http/Controllers/Student/MissionController.php:348
* @route '/submission/{submissionId}/like'
*/
export const like = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

like.definition = {
    methods: ["post"],
    url: '/submission/{submissionId}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::like
* @see app/Http/Controllers/Student/MissionController.php:348
* @route '/submission/{submissionId}/like'
*/
like.url = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return like.definition.url
            .replace('{submissionId}', parsedArgs.submissionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MissionController::like
* @see app/Http/Controllers/Student/MissionController.php:348
* @route '/submission/{submissionId}/like'
*/
like.post = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::like
* @see app/Http/Controllers/Student/MissionController.php:348
* @route '/submission/{submissionId}/like'
*/
const likeForm = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: like.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::like
* @see app/Http/Controllers/Student/MissionController.php:348
* @route '/submission/{submissionId}/like'
*/
likeForm.post = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: like.url(args, options),
    method: 'post',
})

like.form = likeForm

/**
* @see \App\Http\Controllers\Student\MissionController::feedback
* @see app/Http/Controllers/Student/MissionController.php:367
* @route '/submission/{submissionId}/feedback'
*/
export const feedback = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feedback.url(args, options),
    method: 'post',
})

feedback.definition = {
    methods: ["post"],
    url: '/submission/{submissionId}/feedback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::feedback
* @see app/Http/Controllers/Student/MissionController.php:367
* @route '/submission/{submissionId}/feedback'
*/
feedback.url = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return feedback.definition.url
            .replace('{submissionId}', parsedArgs.submissionId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Student\MissionController::feedback
* @see app/Http/Controllers/Student/MissionController.php:367
* @route '/submission/{submissionId}/feedback'
*/
feedback.post = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feedback.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::feedback
* @see app/Http/Controllers/Student/MissionController.php:367
* @route '/submission/{submissionId}/feedback'
*/
const feedbackForm = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: feedback.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::feedback
* @see app/Http/Controllers/Student/MissionController.php:367
* @route '/submission/{submissionId}/feedback'
*/
feedbackForm.post = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: feedback.url(args, options),
    method: 'post',
})

feedback.form = feedbackForm

/**
* @see \App\Http\Controllers\Student\MissionController::getFeedbacks
* @see app/Http/Controllers/Student/MissionController.php:388
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
* @see \App\Http\Controllers\Student\MissionController::getFeedbacks
* @see app/Http/Controllers/Student/MissionController.php:388
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
* @see \App\Http\Controllers\Student\MissionController::getFeedbacks
* @see app/Http/Controllers/Student/MissionController.php:388
* @route '/submission/{submissionId}/feedbacks'
*/
getFeedbacks.get = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getFeedbacks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MissionController::getFeedbacks
* @see app/Http/Controllers/Student/MissionController.php:388
* @route '/submission/{submissionId}/feedbacks'
*/
getFeedbacks.head = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getFeedbacks.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Student\MissionController::getFeedbacks
* @see app/Http/Controllers/Student/MissionController.php:388
* @route '/submission/{submissionId}/feedbacks'
*/
const getFeedbacksForm = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFeedbacks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MissionController::getFeedbacks
* @see app/Http/Controllers/Student/MissionController.php:388
* @route '/submission/{submissionId}/feedbacks'
*/
getFeedbacksForm.get = (args: { submissionId: string | number } | [submissionId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getFeedbacks.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Student\MissionController::getFeedbacks
* @see app/Http/Controllers/Student/MissionController.php:388
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
* @see \App\Http\Controllers\Student\MissionController::finish
* @see app/Http/Controllers/Student/MissionController.php:395
* @route '/mission/{slug}/finish'
*/
export const finish = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

finish.definition = {
    methods: ["post"],
    url: '/mission/{slug}/finish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::finish
* @see app/Http/Controllers/Student/MissionController.php:395
* @route '/mission/{slug}/finish'
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
* @see \App\Http\Controllers\Student\MissionController::finish
* @see app/Http/Controllers/Student/MissionController.php:395
* @route '/mission/{slug}/finish'
*/
finish.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::finish
* @see app/Http/Controllers/Student/MissionController.php:395
* @route '/mission/{slug}/finish'
*/
const finishForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finish.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::finish
* @see app/Http/Controllers/Student/MissionController.php:395
* @route '/mission/{slug}/finish'
*/
finishForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finish.url(args, options),
    method: 'post',
})

finish.form = finishForm

/**
* @see \App\Http\Controllers\Student\MissionController::runCode
* @see app/Http/Controllers/Student/MissionController.php:433
* @route '/mission/{slug}/run-code'
*/
export const runCode = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runCode.url(args, options),
    method: 'post',
})

runCode.definition = {
    methods: ["post"],
    url: '/mission/{slug}/run-code',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Student\MissionController::runCode
* @see app/Http/Controllers/Student/MissionController.php:433
* @route '/mission/{slug}/run-code'
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
* @see \App\Http\Controllers\Student\MissionController::runCode
* @see app/Http/Controllers/Student/MissionController.php:433
* @route '/mission/{slug}/run-code'
*/
runCode.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runCode.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::runCode
* @see app/Http/Controllers/Student/MissionController.php:433
* @route '/mission/{slug}/run-code'
*/
const runCodeForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: runCode.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Student\MissionController::runCode
* @see app/Http/Controllers/Student/MissionController.php:433
* @route '/mission/{slug}/run-code'
*/
runCodeForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: runCode.url(args, options),
    method: 'post',
})

runCode.form = runCodeForm

const mission = {
    show: Object.assign(show, show),
    reflection: Object.assign(reflection, reflection),
    updateRole: Object.assign(updateRole, updateRole),
    completeStep2: Object.assign(completeStep2, completeStep2),
    savePhase3: Object.assign(savePhase3, savePhase3),
    submitPhase4: Object.assign(submitPhase4, submitPhase4),
    vote: Object.assign(vote, vote),
    like: Object.assign(like, like),
    feedback: Object.assign(feedback, feedback),
    getFeedbacks: Object.assign(getFeedbacks, getFeedbacks),
    finish: Object.assign(finish, finish),
    runCode: Object.assign(runCode, runCode),
}

export default mission