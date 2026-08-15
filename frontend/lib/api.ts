const API_URL = 'http://localhost:4000';

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