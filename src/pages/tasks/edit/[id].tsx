import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getTaskById, updateTask } from '../../../utils/supabaseTasks';
import { getProjects } from '../../../utils/supabaseProjects';
import TaskForm from '../../../components/TaskForm';

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

const EditTaskPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [task, setTask] = useState<Task | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: '',
    status: 'open',
    assigned_to: '',
  });

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchTaskDetails(id);
      fetchProjects();
    }
  }, [id]);

  const fetchTaskDetails = async (taskId: string) => {
    setLoading(true);
    try {
      const taskData = await getTaskById(taskId);
      setTask(taskData);
      
      // Initialize form data with task details
      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        due_date: taskData.due_date || '',
        priority: taskData.priority || '',
        status: taskData.status || 'open',
        assigned_to: taskData.assigned_to || '',
      });
      
      setError('');
    } catch (err) {
      console.error('Error fetching task details:', err);
      setError('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    setSaving(true);
    try {
      await updateTask(task.id, {
        ...formData,
        due_date: formData.due_date || null,
      });
      
      // Navigate back to the task details page
      router.push(`/tasks/${task.id}`);
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task');
      setSaving(false);
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

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* Header with back button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Link href={`/tasks/${task.id}`} style={{ color: '#0070f3', marginRight: 16, textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Edit Task</h1>
      </div>

      {error && (
        <div style={{ color: 'red', padding: 12, backgroundColor: '#ffebee', borderRadius: 4, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Project information */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Project:</label>
        <div style={{ padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          {projects.find(p => p.id === task.project_id)?.name || 'Unknown Project'}
        </div>
      </div>

      {/* Task form */}
      <TaskForm
        formData={formData}
        editingTask={task}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/tasks/${task.id}`)}
        handleInputChange={handleInputChange}
      />

      {saving && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p>Saving changes...</p>
        </div>
      )}
    </div>
  );
};

export default EditTaskPage;
