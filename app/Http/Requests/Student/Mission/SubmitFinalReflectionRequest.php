<?php

namespace App\Http\Requests\Student\Mission;

use Illuminate\Foundation\Http\FormRequest;

class SubmitFinalReflectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'final_reflection' => ['required', 'string', 'min:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'final_reflection.required' => 'Refleksi akhir wajib diisi.',
            'final_reflection.min' => 'Refleksi akhir minimal 20 karakter.',
        ];
    }
}
