<?php

namespace App\Http\Requests\Student\Mission;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'target_user_id' => ['required', 'exists:users,id'],
            'role' => ['required', 'string', 'in:Problem Analyzer,Algorithm Designer,Presenter,Leader'],
        ];
    }

    public function messages(): array
    {
        return [
            'target_user_id.required' => 'User ID wajib diisi.',
            'target_user_id.exists' => 'User tidak ditemukan.',
            'role.in' => 'Role yang dipilih tidak valid.',
        ];
    }
}
