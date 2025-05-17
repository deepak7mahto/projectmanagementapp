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

  // UI rendering
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Projects</h1>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      <button
        onClick={() => setShowProjectForm((v) => !v)}
        style={{ marginBottom: 16 }}
      >
        {showProjectForm ? "Cancel" : "New Project"}
      </button>
      {showProjectForm && (
        <form onSubmit={handleCreateProject} style={{ marginBottom: 24 }}>
          <input
            required
            placeholder="Project Name"
            value={projectForm.name}
            onChange={(e) => setProjectForm((f) => ({ ...f, name: e.target.value }))}
            style={{ marginRight: 8, padding: 4 }}
          />
          <input
            placeholder="Description"
            value={projectForm.description}
            onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
            style={{ marginRight: 8, padding: 4 }}
          />
          <button type="submit" style={{ padding: "4px 16px" }}>Create</button>
        </form>
      )}
      {loading && <div>Loading...</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {projects.map((project) => (
          <li
            key={project.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 12,
              marginBottom: 10,
              background: selectedProject?.id === project.id ? "#f0f4ff" : "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={() => setSelectedProject(project)}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{project.name}</div>
              <div style={{ color: "#666", fontSize: 14 }}>{project.description}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProject(project.id);
              }}
              style={{ color: "red", background: "none", border: "none" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {selectedProject && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Tasks for {selectedProject.name}</h2>
          {tasks.length === 0 && <div>No tasks yet.</div>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 4,
                  padding: 8,
                  marginBottom: 8,
                  background: "#fafbfc",
                }}
              >
                <div style={{ fontWeight: 500 }}>{task.title}</div>
                <div style={{ color: "#888", fontSize: 13 }}>
                  Status: {task.status} | Priority: {task.priority}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
