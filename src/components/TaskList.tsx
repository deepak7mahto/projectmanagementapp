import React from 'react';
import TaskCard from './TaskCard';

// Define Task interface locally for now
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string | null;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string | null;
}

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  loading, 
  error, 
  onEditTask, 
  onDeleteTask 
}) => {
  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        <p>No tasks found for this project. Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginBottom: 16 }}>Tasks ({tasks.length})</h3>
      <div style={{ display: 'grid', gap: 16 }}>
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={onEditTask} 
            onDelete={onDeleteTask} 
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
