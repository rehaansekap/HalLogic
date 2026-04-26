<?php

namespace App\Http\Requests\Student\Mission;

use Illuminate\Foundation\Http\FormRequest;

class SubmitPhase4Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file_flowchart' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
            'code_final' => ['required', 'string', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'file_flowchart.required' => 'File flowchart wajib diunggah.',
            'file_flowchart.mimes' => 'File harus berformat PDF, JPG, JPEG, atau PNG.',
            'file_flowchart.max' => 'Ukuran file maksimal 10MB.',
            'code_final.required' => 'Source code final wajib diisi.',
            'code_final.min' => 'Source code minimal 10 karakter.',
        ];
    }
}
