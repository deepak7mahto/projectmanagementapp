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

  // Edit mode state (must always be at the top)
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ref for settings section (must be at the top with other hooks)
  const settingsRef = React.useRef<HTMLDivElement>(null);

  // Sync edit fields with project when project changes
  useEffect(() => {
    if (project) {
      setEditName(project.name);
      setEditDescription(project.description || "");
    }
  }, [project]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchProjectDetails(id);
    }
  }, [id]);

  // Auto-scroll and open edit mode if hash is #settings
  useEffect(() => {
    if (project && typeof window !== 'undefined' && window.location.hash === '#settings') {
      setEditMode(true);
      setTimeout(() => {
        settingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [project]);

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


  // Handle edit toggle
  const handleEditClick = () => {
    setEditMode(true);
    setEditName(project.name);
    setEditDescription(project.description || "");
    setSettingsSuccess("");
    setSettingsError("");
  };
  const handleCancelEdit = () => {
    setEditMode(false);
    setSettingsSuccess("");
    setSettingsError("");
  };
  // Save project settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSuccess("");
    setSettingsError("");
    try {
      const { updateProject } = await import('../../utils/supabaseProjects');
      await updateProject(project.id, { name: editName, description: editDescription });
      setSettingsSuccess("Project updated successfully.");
      setEditMode(false);
      // Reload project data
      fetchProjectDetails(project.id);
    } catch (err: any) {
      setSettingsError("Failed to update project: " + (err.message || err));
    } finally {
      setSettingsLoading(false);
    }
  };

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
        {/* Edit Project Settings Section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 24 }}>Project Settings</h2>
            {!editMode && (
              <button onClick={handleEditClick} style={{ background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Edit</button>
            )}
          </div>
          {editMode ? (
            <form onSubmit={handleSaveSettings} style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <label htmlFor="editName" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Project Name</label>
                <input
                  id="editName"
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label htmlFor="editDescription" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Description</label>
                <textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                />
              </div>
              {settingsSuccess && <div style={{ color: 'green', marginBottom: 8 }}>{settingsSuccess}</div>}
              {settingsError && <div style={{ color: 'red', marginBottom: 8 }}>{settingsError}</div>}
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" disabled={settingsLoading} style={{ background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 500, cursor: 'pointer', opacity: settingsLoading ? 0.6 : 1 }}>Save</button>
                <button type="button" onClick={handleCancelEdit} style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ margin: '16px 0 0 0', fontWeight: 500, fontSize: 20 }}>{project.name}</div>
              {project.description && (
                <p style={{ margin: '8px 0 0 0', color: '#555', fontSize: 16 }}>{project.description}</p>
              )}
              {settingsSuccess && <div style={{ color: 'green', marginTop: 8 }}>{settingsSuccess}</div>}
              {settingsError && <div style={{ color: 'red', marginTop: 8 }}>{settingsError}</div>}
            </>
          )}
        </div>
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
