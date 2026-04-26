<?php

namespace App\Http\Requests\Teacher\Mission;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $mission = $this->route('mission');

        return $this->user()->role === 'teacher'
            && $mission->teacher_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'classroom_id' => ['required', 'exists:classrooms,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'difficulty_level' => ['required', 'integer', 'between:1,5'],
            'video_url' => ['required', 'url', 'regex:/youtube\.com|youtu\.be/'],
            'case_narrative' => ['required', 'string', 'max:1000'],
            'material_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
            'lkpd_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
            'simulator_config' => ['nullable', 'string'],
            'prerequisite_mission_id' => ['nullable', 'exists:missions,id'],
            'started_at' => ['nullable', 'date'],
            'finished_at' => ['nullable', 'date', 'after_or_equal:started_at'],
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'classroom_id.required' => 'Kelas wajib dipilih',
            'classroom_id.exists' => 'Kelas tidak valid',
            'title.required' => 'Judul misi wajib diisi',
            'title.max' => 'Judul maksimal 255 karakter',
            'description.required' => 'Deskripsi wajib diisi',
            'description.max' => 'Deskripsi maksimal 5000 karakter',
            'difficulty_level.required' => 'Tingkat kesulitan wajib dipilih',
            'difficulty_level.between' => 'Tingkat kesulitan harus antara 1-5',
            'video_url.required' => 'URL video wajib diisi',
            'video_url.url' => 'Format URL video tidak valid',
            'video_url.regex' => 'URL harus dari YouTube',
            'case_narrative.required' => 'Narasi kasus wajib diisi',
            'case_narrative.max' => 'Narasi maksimal 1000 karakter',
            'material_pdf.file' => 'File harus berupa dokumen',
            'material_pdf.mimes' => 'File harus berformat PDF',
            'material_pdf.max' => 'Ukuran file maksimal 50MB',
            'lkpd_pdf.file' => 'LKPD harus berupa file',
            'lkpd_pdf.mimes' => 'LKPD harus berformat PDF',
            'lkpd_pdf.max' => 'Ukuran LKPD maksimal 50MB',
            'prerequisite_mission_id.exists' => 'Misi prasyarat tidak valid',
            'started_at.date' => 'Format tanggal mulai tidak valid',
            'finished_at.date' => 'Format tanggal selesai tidak valid',
            'finished_at.after_or_equal' => 'Tanggal selesai harus setelah tanggal mulai',
        ];
    }

    /**
     * Prepare data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->material_pdf)) {
            $this->request->remove('material_pdf');
        }

        if (is_string($this->lkpd_pdf)) {
            $this->request->remove('lkpd_pdf');
        }

        $this->merge([
            'simulator_config' => $this->simulator_config ?: null,
            'prerequisite_mission_id' => $this->prerequisite_mission_id ?: null,
            'started_at' => $this->started_at ?: null,
            'finished_at' => $this->finished_at ?: null,
        ]);
    }
}
