<?php

namespace App\Http\Requests\Teacher\Mission;

use Illuminate\Foundation\Http\FormRequest;

class SaveGradeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->role === 'teacher';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'score' => ['required', 'integer', 'min:0', 'max:100'],
            'teacher_notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'score.required' => 'Nilai wajib diisi',
            'score.integer' => 'Nilai harus berupa angka',
            'score.min' => 'Nilai minimal 0',
            'score.max' => 'Nilai maksimal 100',
            'teacher_notes.max' => 'Catatan maksimal 1000 karakter',
        ];
    }
}
