import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getProjectById } from '../../utils/supabaseProjects';
import { getTasksByProject } from '../../utils/supabaseTasks';
import TaskList from '../../components/TaskList';

interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  created_at: string;
}

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

const ProjectDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchProjectDetails(id);
    }
  }, [id]);

  const fetchProjectDetails = async (projectId: string) => {
    setLoading(true);
    try {
      // Fetch project details
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      
      // Fetch tasks for this project
      const tasksData = await getTasksByProject(projectId);
      setTasks(tasksData || []);
      
      setError('');
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    // Navigate to tasks page with the task ID for editing
    router.push(`/tasks?projectId=${project?.id}&taskId=${task.id}`);
  };

  const handleDeleteTask = async (taskId: string) => {
    // This would be implemented to delete a task
    // For now, we'll just redirect to the tasks page
    router.push(`/tasks?projectId=${project?.id}`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div style={{ color: 'red', textAlign: 'center', padding: 40 }}>
          <p>{error}</p>
          <Link href="/projects" style={{ color: '#0070f3', marginTop: 16, display: 'inline-block' }}>
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>Project not found</p>
          <Link href="/projects" style={{ color: '#0070f3', marginTop: 16, display: 'inline-block' }}>
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* Header with back button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Link href="/projects" style={{ color: '#0070f3', marginRight: 16, textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Project Details</h1>
      </div>

      {/* Project info card */}
      <div style={{ 
        border: '1px solid #eee', 
        borderRadius: 8, 
        padding: 24, 
        marginBottom: 32,
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: 24 }}>{project.name}</h2>
        
        {project.description && (
          <p style={{ margin: '0 0 16px 0', color: '#555', fontSize: 16 }}>
            {project.description}
          </p>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: 16 }}>
          <div style={{ color: '#666', fontSize: 14 }}>
            Created on {formattedDate}
          </div>
          <Link 
            href={`/tasks?projectId=${project.id}`}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#0070f3', 
              color: 'white', 
              borderRadius: 4,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: 14
            }}
          >
            Manage Tasks
          </Link>
        </div>
      </div>

      {/* Tasks section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>Tasks</h2>
          <Link 
            href={`/tasks?projectId=${project.id}`}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#0070f3', 
              color: 'white', 
              borderRadius: 4,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: 14
            }}
          >
            Add New Task
          </Link>
        </div>
        
        <TaskList 
          tasks={tasks}
          loading={false}
          error={''}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
