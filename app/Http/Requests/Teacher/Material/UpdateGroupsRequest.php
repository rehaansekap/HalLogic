<?php

namespace App\Http\Requests\Teacher\Material;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupsRequest extends FormRequest
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
            'groups' => ['present', 'array'],
            'groups.*.group_id' => ['required', 'integer'],
            'groups.*.group_name' => ['required', 'string', 'max:100'],
            'groups.*.group_code' => ['required', 'string', 'max:20'],
            'groups.*.members' => ['required', 'array'],
            'groups.*.members.*.user_id' => ['required', 'exists:users,id'],
            'groups.*.members.*.is_leader' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'groups.required' => 'Data kelompok wajib diisi',
            'groups.array' => 'Format data kelompok tidak valid',
            'groups.*.group_name.required' => 'Nama kelompok wajib diisi',
            'groups.*.group_name.max' => 'Nama kelompok maksimal 100 karakter',
            'groups.*.group_code.required' => 'Kode kelompok wajib diisi',
            'groups.*.members.required' => 'Anggota kelompok wajib diisi',
            'groups.*.members.*.user_id.exists' => 'Siswa tidak ditemukan',
        ];
    }
}
