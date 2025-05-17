import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createProject } from '../../utils/supabaseProjects';
import { getCurrentUserId } from '../../utils/getCurrentUserId';

const AddProjectPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      
      const newProject = await createProject({
        name: formData.name,
        description: formData.description,
        owner_id: userId || undefined, // Convert null to undefined if userId is null
      });
      
      // Navigate to the project details page
      router.push(`/projects/${newProject.id}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      {/* Header with back button */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Link href="/projects" style={{ color: '#0070f3', marginRight: 16, textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Create New Project</h1>
      </div>

      {error && (
        <div style={{ color: 'red', padding: 12, backgroundColor: '#ffebee', borderRadius: 4, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Project form */}
      <div style={{ 
        border: '1px solid #eee', 
        borderRadius: 8, 
        padding: 24, 
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Project Name *</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter project name"
              required
              style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
            />
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter project description"
              style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd', minHeight: 120 }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Link href="/projects">
              <button 
                type="button" 
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: 'white', 
                  color: '#666', 
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </Link>
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#0070f3', 
                color: 'white', 
                border: 'none',
                borderRadius: 4,
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectPage;
