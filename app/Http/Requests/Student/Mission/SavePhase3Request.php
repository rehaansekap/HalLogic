<?php

namespace App\Http\Requests\Student\Mission;

use Illuminate\Foundation\Http\FormRequest;

class SavePhase3Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code_attempt' => ['required', 'string'],
            'language' => ['required', 'string', 'in:cpp'],
        ];
    }

    public function messages(): array
    {
        return [
            'code_attempt.required' => 'Kode eksperimen wajib diisi.',
            'language.in' => 'Bahasa pemrograman tidak valid.',
        ];
    }
}
