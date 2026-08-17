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
```

---

## 🔄 Application Flow

```text
User
 │
 ▼
Next.js Frontend
 │
 ├── Dashboard
 ├── Tasks
 ├── Projects
 └── Profile
 │
 ▼
REST API
 │
 ▼
NestJS Backend
 │
 ├── Tasks
 ├── Subtasks
 └── Projects
 │
 ▼
MongoDB
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB

---

## 1. Clone the Repository

```bash
git clone https://github.com/Sampada0508/ablespace-assignment
cd ablespace-assignment
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## 4. Configure Environment Variables

The backend uses MongoDB for data persistence.

For local development:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ablespace
PORT=4000
```

> Do not commit environment files containing secrets.

---

## 5. Start the Backend

```bash
cd backend
npm run start:dev
```

The backend will run at:

```text
http://localhost:4000
```

---

## 6. Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

# 📌 Key Functional Areas

## Dashboard

The dashboard provides an overview of tasks through:

- Task statistics
- Kanban board
- Task filtering
- Search
- List/Board switching
- Field visibility controls
- Independent task-list scrolling

The task content area uses an independent scroll region so the dashboard header and statistics remain stable while navigating through a large number of tasks.

---

## Task Management

Each task can contain:

- Title
- Description
- Status
- Priority
- Due date
- Members
- Subtasks

Task operations communicate with the backend through REST APIs.

---

## Projects

The Projects section provides a dedicated workspace for organizing projects separately from individual tasks.

Projects can be managed independently while maintaining the same workspace experience as the main task dashboard.

---

## Profile

The Profile section allows users to manage:

- Profile picture
- Email
- Full name
- Username
- Theme
- Accent color

Profile preferences are persisted locally so they remain available after navigation and refresh.

---

# 💡 Design Decisions

## Independent Task Scrolling

The dashboard keeps the main workspace stable while allowing the task list or board to scroll independently.

This prevents users from repeatedly scrolling past the dashboard header and statistics when working with many tasks.

## Reusable Components

Task rendering and task actions use reusable components such as `TaskCard`, helping maintain consistency across different task views.

## Persistent Preferences

Theme, accent color, profile avatar, and profile information are persisted locally so that user preferences remain available after navigation and refresh.

---

# 🧪 Build Verification

The frontend production build can be verified with:

```bash
cd frontend
npm run build
```

The build should complete successfully before deployment.

---

# 🌐 Deployment

### Live Application

```text
https://ablespace-frontend-6193.onrender.com/
```

### GitHub Repository

```text
https://github.com/Sampada0508/ablespace-assignment
```

---

# 🔮 Future Improvements

- Authentication and authorization
- Real user accounts
- Team/member management
- Drag-and-drop task ordering
- Real-time task updates
- Notifications
- Advanced project analytics
- Task activity history
- Improved accessibility
- Automated testing
- Production monitoring

---

# 👩‍💻 Author

**Sampada N. S.**

Built as part of the AbleSpace engineering assignment.
