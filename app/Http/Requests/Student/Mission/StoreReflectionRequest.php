<?php

namespace App\Http\Requests\Student\Mission;

use Illuminate\Foundation\Http\FormRequest;

class StoreReflectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reflection' => ['required', 'string', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'reflection.required' => 'Refleksi wajib diisi.',
            'reflection.min' => 'Refleksi minimal 10 karakter.',
        ];
    }
}
