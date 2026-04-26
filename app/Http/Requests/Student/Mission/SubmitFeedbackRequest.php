<?php

namespace App\Http\Requests\Student\Mission;

use Illuminate\Foundation\Http\FormRequest;

class SubmitFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'min:5', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'message.required' => 'Pesan feedback wajib diisi.',
            'message.min' => 'Feedback minimal 5 karakter.',
            'message.max' => 'Feedback maksimal 500 karakter.',
        ];
    }
}
