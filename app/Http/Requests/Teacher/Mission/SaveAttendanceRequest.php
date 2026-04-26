<?php

namespace App\Http\Requests\Teacher\Mission;

use Illuminate\Foundation\Http\FormRequest;

class SaveAttendanceRequest extends FormRequest
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
            'attendance' => ['required', 'array'],
            'attendance.*.student_id' => ['required', 'exists:users,id'],
            'attendance.*.is_present' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'attendance.required' => 'Data kehadiran wajib diisi',
            'attendance.array' => 'Format data kehadiran tidak valid',
            'attendance.*.student_id.required' => 'ID siswa wajib diisi',
            'attendance.*.student_id.exists' => 'Siswa tidak ditemukan',
            'attendance.*.is_present.required' => 'Status kehadiran wajib diisi',
            'attendance.*.is_present.boolean' => 'Status kehadiran harus true atau false',
        ];
    }
}
