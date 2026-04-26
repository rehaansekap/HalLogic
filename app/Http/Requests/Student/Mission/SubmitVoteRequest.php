<?php

namespace App\Http\Requests\Student\Mission;

use Illuminate\Foundation\Http\FormRequest;

class SubmitVoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'voted_group_id' => ['required', 'integer', 'exists:groups,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'voted_group_id.required' => 'Pilih kelompok yang ingin di-vote.',
            'voted_group_id.exists' => 'Kelompok tidak ditemukan.',
        ];
    }
}
