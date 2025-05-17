import React from 'react';

// Define Project interface locally for now
interface Project {
  id: string;
  name: string;
  description?: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ 
  projects, 
  selectedProjectId, 
  onProjectChange 
}) => {
  return (
    <div>
      <label htmlFor="project-select" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Select Project:</label>
      <select
        id="project-select"
        value={selectedProjectId}
        onChange={e => onProjectChange(e.target.value)}
        style={{ padding: 8, minWidth: 200, borderRadius: 4, border: '1px solid #ddd' }}
      >
        {projects.length === 0 && <option value="">No projects available</option>}
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;
