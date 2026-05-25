<?php

namespace App\Http\Requests\Student\Material;

use Illuminate\Foundation\Http\FormRequest;

class StoreReflectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if (is_array($this->input('reflection'))) {
            return [
                'reflection' => ['required', 'array', 'min:1'],
                'reflection.*' => ['required', 'string', 'min:5'],
            ];
        }

        return [
            'reflection' => ['required', 'string', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'reflection.required' => 'Refleksi wajib diisi.',
            'reflection.min' => 'Refleksi minimal 10 karakter.',
            'reflection.array' => 'Refleksi tidak valid.',
            'reflection.*.required' => 'Semua pertanyaan refleksi wajib dijawab.',
            'reflection.*.min' => 'Setiap jawaban refleksi minimal 5 karakter.',
        ];
    }
}
