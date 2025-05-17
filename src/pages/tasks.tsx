import React, { useEffect, useState } from 'react';
import { getTasksByProject, createTask, updateTask, deleteTask, getTaskById } from '../utils/supabaseTasks';
import { getProjects } from '../utils/supabaseProjects';
import { getCurrentUserId } from '../utils/getCurrentUserId';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Import components
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import ProjectSelector from '../components/ProjectSelector';

// Import types and constants
import type { Task, Project } from '../utils/constants';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants';

const TaskManagementPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: '',
    status: 'open',
    assigned_to: '',
    // project_id will be set from selectedProjectId
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Check for projectId in URL query parameters
  useEffect(() => {
    const { projectId, taskId } = router.query;
    
    // If projectId is in the URL, select that project
    if (projectId && typeof projectId === 'string') {
      setSelectedProjectId(projectId);
    }
    
    // If taskId is in the URL, load that task for editing
    if (taskId && typeof taskId === 'string' && selectedProjectId) {
      // Load the specific task for editing
      const loadTaskForEditing = async () => {
        try {
          const task = await getTaskById(taskId);
          if (task) {
            startEditingTask(task);
          }
        } catch (err) {
          console.error('Error loading task for editing:', err);
        }
      };
      
      loadTaskForEditing();
    }
  }, [router.query, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    } else {
      setTasks([]);
    }
  }, [selectedProjectId]);

  const fetchTasks = async (projectId: string) => {
    setLoading(true);
    try {
      const data = await getTasksByProject(projectId);
      setTasks(data || []);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data || []);
      // More explicit check to satisfy TypeScript
      if (data && data.length > 0 && data[0]) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      setError('Failed to load projects');
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startEditingTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date || '',
      priority: task.priority || '',
      status: task.status || 'open',
      assigned_to: task.assigned_to || ''
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      due_date: '',
      priority: '',
      status: 'open',
      assigned_to: ''
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a project');
      return;
    }
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        setError('Could not get user ID. Please log in.');
        return;
      }
      
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, {
          ...formData,
          due_date: formData.due_date || null,
        });
        setEditingTask(null);
      } else {
        // Create new task
        await createTask({
          ...formData,
          project_id: selectedProjectId,
          created_by: userId,
          due_date: formData.due_date || null,
        });
      }
      
      setShowForm(false);
      setFormData({ 
        title: '', 
        description: '', 
        due_date: '', 
        priority: '', 
        status: 'open',
        assigned_to: ''
      });
      fetchTasks(selectedProjectId);
    } catch (err) {
      setError(editingTask ? 'Failed to update task' : 'Failed to create task');
      console.error(err);
    }
  };



  // Handle task deletion
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      fetchTasks(selectedProjectId);
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  // Handle project selection
  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Task Management</h1>
        <Link href="/projects" style={{ textDecoration: 'none', color: '#0070f3' }}>
          View All Projects
        </Link>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24, 
        padding: 16, 
        backgroundColor: '#f5f5f5', 
        borderRadius: 8 
      }}>
        <ProjectSelector 
          projects={projects} 
          selectedProjectId={selectedProjectId} 
          onProjectChange={handleProjectChange} 
        />
        
        <button 
          onClick={() => {
            if (showForm && !editingTask) {
              setShowForm(false);
            } else if (showForm && editingTask) {
              cancelEdit();
            } else {
              setShowForm(true);
            }
          }}
          style={{ 
            padding: '8px 16px', 
            borderRadius: 4, 
            border: 'none', 
            background: showForm ? '#f44336' : '#0070f3', 
            color: 'white',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {showForm ? (editingTask ? 'Cancel Editing' : 'Cancel') : 'Add New Task'}
        </button>
      </div>
      
      {showForm && (
        <TaskForm 
          formData={formData}
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={cancelEdit}
          handleInputChange={handleInputChange}
        />
      )}
      
      <TaskList 
        tasks={tasks}
        loading={loading}
        error={error}
        onEditTask={startEditingTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default TaskManagementPage;
