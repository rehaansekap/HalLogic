import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::grade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:251
* @route '/teacher/submission/{submission}/grade'
*/
export const grade = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: grade.url(args, options),
    method: 'post',
})

grade.definition = {
    methods: ["post"],
    url: '/teacher/submission/{submission}/grade',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::grade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:251
* @route '/teacher/submission/{submission}/grade'
*/
grade.url = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return grade.definition.url
            .replace('{submission}', parsedArgs.submission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::grade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:251
* @route '/teacher/submission/{submission}/grade'
*/
grade.post = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: grade.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::grade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:251
* @route '/teacher/submission/{submission}/grade'
*/
const gradeForm = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: grade.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teacher\TeacherMaterialController::grade
* @see app/Http/Controllers/Teacher/TeacherMaterialController.php:251
* @route '/teacher/submission/{submission}/grade'
*/
gradeForm.post = (args: { submission: string | number } | [submission: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: grade.url(args, options),
    method: 'post',
})

grade.form = gradeForm

const submission = {
    grade: Object.assign(grade, grade),
}

export default submission