### Teacher — Halaman Detail Material

Setelah guru memilih detail material, aplikasi memanggil `TeacherMaterialController::show` dan merender halaman detail material di index.tsx. Controller mengambil data materi berdasarkan `slug` dan `teacher_id`, lalu memuat:

- metadata material (`title`, `description`, `difficulty_level`, `slug`)
- daftar `students` dalam kelas
- struktur `groups` saat ini
- `groupsMonitoring` yang berisi status tiap kelompok pada setiap fase material, refleksi, dan file submission.
- ringkasan `stats` kelompok: total, selesai, dalam pengerjaan, dan belum mulai
- data `initialAttendance` apabila sudah ada presensi tersimpan
- data `allReflections` dari siswa

Halaman detail material menampilkan:

- `MaterialDetailHeader`: judul material, deskripsi singkat, level kesulitan, tombol edit (`/teacher/Material/{slug}/edit`), dan tombol delete yang membuka `DeleteMaterialModal`
- `MaterialStats`: empat kartu statistik yang menunjukkan jumlah kelompok total, selesai, sedang berjalan, dan belum mulai
- `MaterialTabs`: tab navigasi antara tiga area utama: `Kehadiran`, `Kelompok`, dan `Monitoring`

### Apa yang akan dilakukan di halaman detail Material

1. **Tab Kehadiran**
    - Menampilkan semua siswa kelas dalam `TabAttendance`
    - Guru dapat menandai kehadiran per siswa
    - Tombol “Simpan” mengirim data ke endpoint `/teacher/Material/{MaterialId}/attendance`
    - Setelah sukses, UI memberi sweetalert2 dan memuat ulang presensi

2. **Tab Kelompok**
    - Menampilkan `TabGroupManagement` dengan daftar kelompok dan siswa yang belum ditempatkan
    - Guru bisa:
        - membuat atau menghapus kelompok
        - mengubah nama grup
        - menetapkan atau memindahkan anggota
        - mengatur peran `Leader` suatu kelompok
        - membuat pengelompokan otomatis / reset pembagian
    - Setelah selesai, guru menyimpan struktur kelompok ke endpoint `/teacher/Material/{MaterialId}/update-groups`

3. **Tab Monitoring**
    - Menampilkan status kemajuan tiap kelompok di `TabMonitoring`
    - Terdapat kartu progress group, ringkasan monitoring, dan refleksi siswa
    - Guru dapat melihat detail submission kelompok dengan membuka `SubmissionDetailModal`
    - Modal submission memungkinkan guru melihat:
        - anggota group
        - file submission
        - form penilaian/nilai
    - Dari modal ini, guru bisa menyimpan grade ke endpoint `/teacher/submission/{submissionId}/grade`

4. **Delete Material**
    - Tombol delete membuka `DeleteMaterialModal` (Menggunakan yang ada di dashboard)
    - Modal menampilkan peringatan bahwa penghapusan akan menghapus semua data terkait: kelompok, progress, refleksi, submission, nilai, kehadiran, dan file materi
    - Konfirmasi dilakukan dengan mengetik judul material untuk mencegah kesalahan
    - Setelah dikonfirmasi, method `destroy` memanggil `TeacherMaterialService::deleteMaterial` untuk menghapus material dan semua data terkait secara aman

Jadi, halaman detail material guru bukan hanya menampilkan informasi, tetapi juga menjadi pusat operasional: mengelola presensi, menyusun kelompok, memantau progres, menilai hasil kelompok, dan memberi akses cepat untuk edit atau hapus material.
