import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createTask } from '../../utils/supabaseTasks';
import { getProjects } from '../../utils/supabaseProjects';
import { getCurrentUserId } from '../../utils/getCurrentUserId';
import TaskForm from '../../components/TaskForm';

interface Project {
  id: string;
  name: string;
  description?: string;
}

const AddTaskPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loading, setLoading] = useState(false);
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
    fetchProjects();
  }, []);

  useEffect(() => {
    // If projectId is provided in URL, select it
    if (projectId && typeof projectId === 'string') {
      setSelectedProjectId(projectId);
    }
  }, [projectId]);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data || []);
      
      // If projectId is not in URL but we have projects, select the first one
      if (!projectId && data && data.length > 0 && data[0]) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a project');
      return;
    }
    
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setError('Could not get user ID. Please log in.');
        setLoading(false);
        return;
      }
      
      const newTask = await createTask({
        ...formData,
        project_id: selectedProjectId,
        created_by: userId,
        due_date: formData.due_date || null,
      });
      
      // Navigate to the task details page
      router.push(`/tasks/${newTask.id}`);
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* Header with back button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Link href="/tasks" style={{ color: '#0070f3', marginRight: 16, textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Add New Task</h1>
      </div>

      {error && (
        <div style={{ color: 'red', padding: 12, backgroundColor: '#ffebee', borderRadius: 4, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Project selector */}
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="project-select" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Select Project:</label>
        <select
          id="project-select"
          value={selectedProjectId}
          onChange={handleProjectChange}
          style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      {/* Task form */}
      <TaskForm
        formData={formData}
        editingTask={null}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/tasks')}
        handleInputChange={handleInputChange}
      />

      {loading && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p>Creating task...</p>
        </div>
      )}
    </div>
  );
};

export default AddTaskPage;
