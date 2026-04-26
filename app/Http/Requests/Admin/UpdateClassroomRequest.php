<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClassroomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'academic_year' => ['required', 'string', 'max:20'],
            'teacher_id' => ['required', 'exists:users,id'],
            'regenerate_code' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kelas wajib diisi',
            'name.max' => 'Nama kelas maksimal 255 karakter',
            'academic_year.required' => 'Tahun ajaran wajib diisi',
            'academic_year.max' => 'Tahun ajaran maksimal 20 karakter',
            'teacher_id.required' => 'Guru pengajar wajib dipilih',
            'teacher_id.exists' => 'Guru tidak ditemukan',
        ];
    }
}
