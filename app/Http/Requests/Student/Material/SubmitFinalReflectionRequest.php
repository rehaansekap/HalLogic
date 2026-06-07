<?php

namespace App\Http\Requests\Student\Material;

use Illuminate\Foundation\Http\FormRequest;

class SubmitFinalReflectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if (is_array($this->input('final_reflection'))) {
            return [
                'final_reflection' => ['required', 'array', 'min:1'],
                'final_reflection.*' => ['required', 'string', 'min:15'],
            ];
        }

        return [
            'final_reflection' => ['required', 'string', 'min:15'],
        ];
    }

    public function messages(): array
    {
        return [
            'final_reflection.required' => 'Refleksi akhir wajib diisi.',
            'final_reflection.min' => 'Refleksi akhir minimal 15 karakter.',
            'final_reflection.array' => 'Refleksi akhir tidak valid.',
            'final_reflection.*.required' => 'Semua pertanyaan refleksi akhir wajib dijawab.',
            'final_reflection.*.min' => 'Setiap jawaban refleksi akhir minimal 15 karakter.',
        ];
    }
}
