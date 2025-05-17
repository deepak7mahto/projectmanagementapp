import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getTaskById, updateTask, deleteTask } from '../../utils/supabaseTasks';
import { getProjectById } from '../../utils/supabaseProjects';

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

interface Project {
  id: string;
  name: string;
  description?: string;
}

const TaskDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchTaskDetails(id);
    }
  }, [id]);

  const fetchTaskDetails = async (taskId: string) => {
    setLoading(true);
    try {
      // Fetch task details
      const taskData = await getTaskById(taskId);
      setTask(taskData);
      
      // Fetch associated project details
      if (taskData.project_id) {
        const projectData = await getProjectById(taskData.project_id);
        setProject(projectData);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = () => {
    router.push(`/tasks/edit/${task?.id}`);
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        router.push('/tasks');
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task');
      }
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#0070f3';
      case 'in_progress': return '#f5a623';
      case 'review': return '#7928ca';
      case 'completed': return '#0070f3';
      default: return '#777';
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return '#0070f3';
      case 'Medium': return '#f5a623';
      case 'High': return '#ff0000';
      case 'Urgent': return '#7928ca';
      default: return '#777';
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div style={{ color: 'red', textAlign: 'center', padding: 40 }}>
          <p>{error}</p>
          <Link href="/tasks" style={{ color: '#0070f3', marginTop: 16, display: 'inline-block' }}>
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>Task not found</p>
          <Link href="/tasks" style={{ color: '#0070f3', marginTop: 16, display: 'inline-block' }}>
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  // Format dates
  const formattedCreatedDate = new Date(task.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedDueDate = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'No due date';

  const statusColor = getStatusColor(task.status);
  const priorityColor = getPriorityColor(task.priority || '');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* Header with back button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Link href="/tasks" style={{ color: '#0070f3', marginRight: 16, textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Task Details</h1>
      </div>

      {/* Task info card */}
      <div style={{ 
        border: '1px solid #eee', 
        borderRadius: 8, 
        padding: 24, 
        marginBottom: 32,
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: 24 }}>{task.title}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <span 
              style={{ 
                display: 'inline-block', 
                padding: '4px 12px', 
                borderRadius: 16, 
                fontSize: 14, 
                backgroundColor: `${statusColor}20`, 
                color: statusColor,
                fontWeight: 500
              }}
            >
              {task.status.replace('_', ' ')}
            </span>
            {task.priority && (
              <span 
                style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  borderRadius: 16, 
                  fontSize: 14, 
                  backgroundColor: `${priorityColor}20`, 
                  color: priorityColor,
                  fontWeight: 500
                }}
              >
                {task.priority}
              </span>
            )}
          </div>
        </div>
        
        {task.description && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Description</h3>
            <p style={{ margin: 0, color: '#555', fontSize: 16, lineHeight: 1.5 }}>
              {task.description}
            </p>
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 16, margin: '0 0 8px 0' }}>Project</h3>
            {project ? (
              <Link 
                href={`/projects/${project.id}`} 
                style={{ color: '#0070f3', textDecoration: 'none' }}
              >
                {project.name}
              </Link>
            ) : (
              <span style={{ color: '#666' }}>Unknown project</span>
            )}
          </div>
          
          <div>
            <h3 style={{ fontSize: 16, margin: '0 0 8px 0' }}>Assigned To</h3>
            <span style={{ color: '#666' }}>{task.assigned_to || 'Unassigned'}</span>
          </div>
          
          <div>
            <h3 style={{ fontSize: 16, margin: '0 0 8px 0' }}>Due Date</h3>
            <span style={{ color: '#666' }}>{formattedDueDate}</span>
          </div>
          
          <div>
            <h3 style={{ fontSize: 16, margin: '0 0 8px 0' }}>Created</h3>
            <span style={{ color: '#666' }}>{formattedCreatedDate}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #eee', paddingTop: 16 }}>
          <button
            onClick={handleEditTask}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#0070f3', 
              color: 'white', 
              border: 'none',
              borderRadius: 4,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Edit Task
          </button>
          <button
            onClick={handleDeleteTask}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: 'white', 
              color: '#f44336', 
              border: '1px solid #f44336',
              borderRadius: 4,
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
