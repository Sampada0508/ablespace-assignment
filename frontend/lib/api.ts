const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function createGuest(guestId: string) {
  const response = await fetch(`${API_URL}/users/guest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ guestId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create guest user');
  }

  return response.json();
}

export async function getTasks(userId: string) {
  const response = await fetch(
    `${API_URL}/tasks?userId=${encodeURIComponent(userId)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

export async function createTask(task: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  userId: string;
}) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
}

export async function updateTask(
  taskId: string,
  userId: string,
  updates: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    labels?: string[];
    resources?: {
      _id?: string;
      name: string;
      url: string;
    }[];
  },
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}?userId=${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
}

export async function deleteTask(
  taskId: string,
  userId: string,
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}?userId=${encodeURIComponent(userId)}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  return response.json();
}

export async function createSubtask(
  taskId: string,
  userId: string,
  subtask: {
    title: string;
    priority?: string;
    dueDate?: string;
  },
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}/subtasks?userId=${encodeURIComponent(userId)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subtask),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to create subtask');
  }

  return response.json();
}

export async function updateSubtask(
  taskId: string,
  subtaskId: string,
  userId: string,
  updates: {
    title?: string;
    priority?: string;
    dueDate?: string;
    completed?: boolean;
  },
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}/subtasks/${subtaskId}?userId=${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update subtask');
  }

  return response.json();
}

export async function deleteSubtask(
  taskId: string,
  subtaskId: string,
  userId: string,
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}/subtasks/${subtaskId}?userId=${encodeURIComponent(userId)}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to delete subtask');
  }

  return response.json();
}


export async function createUpdate(
  taskId: string,
  userId: string,
  update: {
    text: string;
    userName: string;
  },
) {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}/updates?userId=${encodeURIComponent(userId)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to create update');
  }

  return response.json();
}

export async function getProjects(userId: string) {
  const response = await fetch(
    `${API_URL}/projects?userId=${encodeURIComponent(userId)}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return response.json();
}

export async function createProject(project: {
  name: string;
  priority?: string;
  lead: string;
  dueDate?: string;
  userId: string;
}) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  return response.json();
}

export async function updateProject(
  projectId: string,
  userId: string,
  updates: {
    name?: string;
    priority?: string;
    lead?: string;
    dueDate?: string;
  },
) {
  const response = await fetch(
    `${API_URL}/projects/${projectId}?userId=${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update project');
  }

  return response.json();
}

export async function deleteProject(
  projectId: string,
  userId: string,
) {
  const response = await fetch(
    `${API_URL}/projects/${projectId}?userId=${encodeURIComponent(userId)}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  return response.json();
}
