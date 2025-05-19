import React, { useState, useEffect } from 'react';
import TagSelector from './TagSelector';
import UserSelector from './UserSelector';
import { getTagsForTask } from '../utils/supabaseTags';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/constants';

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

interface TaskFormProps {
  formData: {
    title: string;
    description: string;
    due_date: string;
    priority: string;
    status: string;
    assigned_to: string;
  };
  editingTask: Task | null;
  onSubmit: (e: React.FormEvent, selectedTagIds?: string[]) => Promise<void>;
  onCancel: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  formData,
  editingTask,
  onSubmit,
  onCancel,
  handleInputChange
}) => {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  
  // Load tags for the task if editing
  useEffect(() => {
    const loadTaskTags = async () => {
      if (editingTask) {
        try {
          const tags = await getTagsForTask(editingTask.id);
          setSelectedTagIds(tags.map(tag => tag.id));
        } catch (err) {
          console.error('Error loading task tags:', err);
        }
      } else {
        setSelectedTagIds([]);
      }
    };
    
    loadTaskTags();
  }, [editingTask]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, selectedTagIds);
  };
  
  const handleUserChange = (userId: string) => {
    const event = {
      target: {
        name: 'assigned_to',
        value: userId
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    handleInputChange(event);
  };

  return (
    <form 
      onSubmit={handleFormSubmit} 
      style={{ 
        marginTop: 16, 
        marginBottom: 32, 
        padding: 24, 
        border: '1px solid #eee', 
        borderRadius: 8, 
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 24, color: '#333' }}>
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </h3>
      
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#444' }}>Title *</label>
        <input
          id="title"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleInputChange}
          required
          style={{ 
            display: 'block', 
            width: '100%', 
            padding: '10px 12px', 
            borderRadius: 6, 
            border: '1px solid #ddd',
            fontSize: 16
          }}
        />
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#444' }}>Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Detailed task description"
          value={formData.description}
          onChange={handleInputChange}
          style={{ 
            display: 'block', 
            width: '100%', 
            padding: '10px 12px', 
            borderRadius: 6, 
            border: '1px solid #ddd', 
            minHeight: 100,
            fontSize: 16,
            lineHeight: 1.5
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="due_date" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#444' }}>Due Date</label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleInputChange}
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '10px 12px', 
              borderRadius: 6, 
              border: '1px solid #ddd',
              fontSize: 16
            }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <label htmlFor="priority" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#444' }}>Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '10px 12px', 
              borderRadius: 6, 
              border: '1px solid #ddd',
              fontSize: 16,
              appearance: 'none',
              backgroundImage: 'url("/chevron-down.svg")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
            }}
          >
            <option value="">Select Priority</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="status" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#444' }}>Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            style={{ 
              display: 'block', 
              width: '100%', 
              padding: '10px 12px', 
              borderRadius: 6, 
              border: '1px solid #ddd',
              fontSize: 16,
              appearance: 'none',
              backgroundImage: 'url("/chevron-down.svg")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px'
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div style={{ flex: 1 }}>
          <UserSelector 
            selectedUserId={formData.assigned_to} 
            onChange={handleUserChange} 
          />
        </div>
      </div>
      
      <div style={{ marginBottom: 24 }}>
        <TagSelector 
          selectedTagIds={selectedTagIds} 
          onChange={setSelectedTagIds} 
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
        <button 
          type="button" 
          onClick={onCancel}
          style={{ 
            padding: '10px 20px', 
            borderRadius: 6, 
            border: '1px solid #ddd', 
            background: '#fff',
            fontSize: 16,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Cancel
        </button>
        <button 
          type="submit"
          style={{ 
            padding: '10px 20px', 
            borderRadius: 6, 
            border: 'none', 
            background: '#0070f3', 
            color: 'white', 
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
