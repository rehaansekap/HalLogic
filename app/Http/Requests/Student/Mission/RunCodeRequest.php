<?php

namespace App\Http\Requests\Student\Mission;

use Illuminate\Foundation\Http\FormRequest;

class RunCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:20000'],
            'language' => ['required', 'string', 'in:cpp'],
            'stdin' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
