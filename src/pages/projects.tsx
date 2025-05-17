import React, { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from "../utils/supabaseProjects";
import { getTasksByProject } from "../utils/supabaseTasks";
import Link from "next/link";
import "../styles/projects.css";

// Project and Task types
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
  status: string;
  priority: string;
  due_date?: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  // Load all projects
  useEffect(() => {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Load tasks for selected project
  useEffect(() => {
    if (selectedProject) {
      setLoading(true);
      getTasksByProject(selectedProject.id)
        .then(setTasks)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setTasks([]);
    }
  }, [selectedProject]);

  // Project CRUD handlers
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const newProject = await createProject(projectForm);
      setProjects((prev) => [newProject, ...prev]);
      setProjectForm({ name: "", description: "" });
      setShowProjectForm(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to project details page
  const navigateToProjectDetails = (projectId: string) => {
    window.location.href = `/projects/${projectId}`;
  };

  // UI rendering
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Projects</h1>
        <button
          onClick={() => setShowProjectForm((v) => !v)}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: showProjectForm ? '#f44336' : '#0070f3', 
            color: 'white', 
            border: 'none',
            borderRadius: 4,
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          {showProjectForm ? "Cancel" : "New Project"}
        </button>
      </div>
      
      {error && <div style={{ color: "red", padding: 12, backgroundColor: '#ffebee', borderRadius: 4, marginBottom: 16 }}>{error}</div>}
      
      {showProjectForm && (
        <div style={{ 
          marginBottom: 24, 
          padding: 16, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 8,
          border: '1px solid #eee'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Create New Project</h3>
          <form onSubmit={handleCreateProject}>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Project Name *</label>
              <input
                id="name"
                required
                placeholder="Enter project name"
                value={projectForm.name}
                onChange={(e) => setProjectForm((f) => ({ ...f, name: e.target.value }))}
                style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="description" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Description</label>
              <textarea
                id="description"
                placeholder="Enter project description"
                value={projectForm.description}
                onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
                style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd', minHeight: 80 }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
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
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
          <p>No projects found. Create a new project to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 16,
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: "pointer"
              }}
              // Using className for hover effects instead of inline styles
              className="project-card"
              onClick={() => navigateToProjectDetails(project.id)}
            >
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{project.name}</h3>
                <p style={{ margin: 0, color: "#666", fontSize: 14, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {project.description || 'No description provided'}
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid #eee'
              }}>
                <div style={{ fontSize: 12, color: '#888' }}>
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
                
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToProjectDetails(project.id);
                    }}
                    style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#0070f3', 
                      color: 'white', 
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    style={{ 
                      padding: '4px 8px', 
                      backgroundColor: 'white', 
                      color: '#f44336', 
                      border: '1px solid #f44336',
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
