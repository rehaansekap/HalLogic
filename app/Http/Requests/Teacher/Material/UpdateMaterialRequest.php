<?php

namespace App\Http\Requests\Teacher\Material;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMaterialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $material = $this->route('material');

        return $this->user()->role === 'teacher'
            && $material->teacher_id === $this->user()->id;
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
            'video_url' => ['required', 'url', 'regex:/youtube\.com|youtu\.be|drive\.google\.com/'],
            'case_narrative' => ['required', 'string', 'max:1000'],
            'material_pdf' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:51200'],
            'remove_pdf' => ['nullable', 'boolean'],
            'simulator_config' => ['nullable', 'json'],
            'prerequisite_material_id' => ['nullable', 'exists:materials,id'],
            'started_at' => ['nullable', 'date'],
            'finished_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'summary' => ['required', 'string', 'max:2000'],
            'learning_objectives' => ['required', 'array', 'min:1'],
            'learning_objectives.*' => ['required', 'string', 'max:255'],
            'pre_reflection_questions' => ['nullable', 'array'],
            'pre_reflection_questions.*' => ['required', 'string', 'max:255'],
            'post_reflection_questions' => ['nullable', 'array'],
            'post_reflection_questions.*' => ['required', 'string', 'max:255'],
            'sub_materials' => ['required', 'array', 'min:1'],
            'sub_materials.*.title' => ['required', 'string', 'max:255'],
            'sub_materials.*.content' => ['required', 'string'],
            'sub_materials.*.image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'sub_materials.*.image_path' => ['nullable', 'string'],
            'code_examples' => ['nullable', 'array'],
            'code_examples.*.title' => ['required', 'string', 'max:255'],
            'code_examples.*.code' => ['required', 'string'],
            'code_examples.*.output' => ['required', 'string'],
            'code_examples.*.explanation' => ['required', 'string'],
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
            'video_url.regex' => 'URL harus dari YouTube atau Google Drive',
            'case_narrative.required' => 'Narasi kasus wajib diisi',
            'case_narrative.max' => 'Narasi maksimal 1000 karakter',
            'material_pdf.file' => 'File harus berupa dokumen',
            'material_pdf.mimes' => 'File harus berformat PDF, DOC, atau DOCX',
            'material_pdf.max' => 'Ukuran file materi maksimal 50MB',
            'prerequisite_material_id.exists' => 'Material prasyarat tidak valid',
            'started_at.date' => 'Format tanggal mulai tidak valid',
            'finished_at.date' => 'Format tanggal selesai tidak valid',
            'finished_at.after_or_equal' => 'Tanggal selesai harus setelah tanggal mulai',
            'summary.required' => 'Ringkasan materi wajib diisi',
            'summary.max' => 'Ringkasan materi maksimal 2000 karakter',
            'learning_objectives.required' => 'Tujuan pembelajaran wajib diisi',
            'learning_objectives.array' => 'Tujuan pembelajaran tidak valid',
            'learning_objectives.min' => 'Minimal harus mengisi satu tujuan pembelajaran',
            'learning_objectives.*.required' => 'Tujuan pembelajaran tidak boleh kosong',
            'learning_objectives.*.max' => 'Tujuan pembelajaran maksimal 255 karakter',
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

        $this->merge([
            'simulator_config' => $this->simulator_config ?: null,
            'prerequisite_material_id' => $this->prerequisite_material_id ?: null,
            'started_at' => $this->started_at ?: null,
            'finished_at' => $this->finished_at ?: null,
        ]);
    }
}
