<?php

namespace App\Http\Requests\Student\Material;

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
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['required', 'file', 'mimes:pdf,doc,docx,txt,c', 'max:10240'],
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
