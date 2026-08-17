# AbleSpace – Task Management Application

A full-stack task management application built as part of the AbleSpace engineering assignment.

The application provides a clean workspace for managing tasks, projects, subtasks, user profile settings, task filtering, and different task views.

---

## ✨ Features

### 📋 Task Management

- Create new tasks
- Update task status
- Edit task details
- Delete tasks
- Set task priority
- Add due dates
- Manage subtasks
- Search tasks
- Filter tasks by status
- Switch between Board and List views

### 📊 Dashboard

- Total task count
- To Do count
- In Progress count
- Completed count
- Kanban-style task board
- Scrollable task area
- Responsive layout

### 📁 Projects

- Dedicated Projects workspace
- Create and manage projects
- Project-specific organization
- Clean workspace navigation

### 👤 Profile

- Upload profile avatar
- Edit email
- Edit full name
- Edit username
- Persist profile information
- Theme selection
- Accent color selection

### 🎨 UI / UX

- Responsive design
- Consistent spacing and typography
- Reusable task components
- Interactive menus and controls
- Persistent theme preferences
- Clean dashboard layout

---

## 🛠 Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- REST APIs

### Database

- MongoDB
- Mongoose

### Development

- Git
- GitHub
- npm

---

## 🏗 Architecture

```text
AbleSpace Assignment
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── profile/
│   │   ├── projects/
│   │   └── tasks/[id]/
│   │
│   ├── components/
│   │   └── TaskCard.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   └── types/
│       └── task.ts
│
└── backend/
    └── src/
        ├── projects/
        │   ├── dto/
        │   ├── schemas/
        │   ├── projects.controller.ts
        │   ├── projects.service.ts
        │   └── projects.module.ts
        │
        └── tasks/
            ├── dto/
            ├── schemas/
            ├── tasks.controller.ts
            └── tasks.service.ts