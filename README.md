# HalLogic 🚀

**HalLogic** is a modern Learning Management System (LMS) designed specifically to facilitate learning logic and programming in an interactive and structured way. Built using the latest technologies to provide a premium and responsive user experience.

---

## ✨ Key Features

- 👥 **Multi-Role System**: Full support for Admin, Teacher, and Student roles.
- 🏫 **Classroom Management**: Manage students within classes with unique access codes.
- 📚 **Learning Materials**: Digital learning material distribution (PDF & Video) with a prerequisite system.
- 🤝 **Group Collaboration**: Automated group work system with team progress tracking.
- 📝 **Assignments & Submissions**: Task submission features with support for various file formats.
- 📊 **Grading & Feedback**: A grading system that allows teachers to provide scores and notes directly to groups.
- 🧠 **Self-Reflection**: Features for students to reflect after completing materials.
- 📅 **Digital Attendance**: Integrated student attendance tracking.
- 🎮 **Simple Gamification**: Track student XP and Levels to increase learning motivation.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [Laravel 13](https://laravel.com)
- **PHP Version**: 8.4+
- **Authentication**: [Laravel Fortify](https://laravel.com/docs/fortify)
- **Routing**: [Laravel Wayfinder](https://github.com/laravel/wayfinder)

### Frontend
- **Framework**: [React 19](https://react.dev)
- **Adapter**: [Inertia.js v3](https://inertiajs.com)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components**: Radix UI, Headless UI, Lucide Icons
- **Animations**: Framer Motion
- **Icons**: Lucide React & Heroicons

---

## 🚀 Installation Guide (Project Setup)

Follow these steps to run this project in your local environment:

### 1. Prerequisites
Ensure you have installed:
- **PHP** (Minimum version 8.4)
- **Composer**
- **Node.js** & **NPM**
- **SQLite** (or your database of choice)

### 2. Clone Repository
```bash
git clone https://github.com/username/HalLogic.git
cd HalLogic
```

### 3. Install Backend Dependencies
```bash
composer install
```

### 4. Install Frontend Dependencies
```bash
npm install
```

### 5. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Generate Application Key:
```bash
php artisan key:generate
```

### 6. Database Preparation
By default, this project is configured to use SQLite. If you want to use another database, adjust it in the `.env` file.

Run migrations and seeders to get the initial data:
```bash
php artisan migrate --seed
```

### 7. Storage Link
Create a symlink for public file access (PDF materials, etc.):
```bash
php artisan storage:link
```

### 8. Run the Project
Use the following command to run the development server (Laravel & Vite simultaneously):
```bash
composer run dev
```
The application will be available at `http://localhost:8000`.

---

## 🔑 Default Accounts (Seeder)

Use the following accounts to test the available features:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@sekolah.id` | `123123123` |
| **Teacher** | `guru1@sekolah.id` | `123123123` |
| **Student** | `siswa1@sekolah.id` | `123123123` |

*(Available up to `siswa50@sekolah.id`)*

---

## 💻 Important Commands

- **Run Dev**: `composer run dev`
- **Build for Production**: `npm run build`
- **Lint PHP**: `composer run lint`
- **Check Types**: `npm run types:check`
- **Format Code**: `npm run format`

---

## 📁 Key Directory Structure

- `app/Http/Controllers`: Backend logic and APIs.
- `app/Models`: Database schema definitions.
- `resources/js/pages`: React pages (Inertia).
- `resources/js/components`: Reusable UI components.
- `routes/`: Web and API route definitions.
- `database/migrations`: Database schemas.

---

Built with ❤️ for the advancement of IT education.
