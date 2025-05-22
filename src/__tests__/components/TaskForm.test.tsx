import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../../components/TaskForm';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../utils/constants';

// Mock child components
jest.mock('../../components/TagSelector', () => {
  return function MockTagSelector({ selectedTagIds, onChange }: { selectedTagIds: string[], onChange: (tags: string[]) => void }) {
    return (
      <div data-testid="tag-selector">
        <button type="button" onClick={() => onChange(['tag1', 'tag2'])}>Select Tags</button>
        <div>Selected Tags: {selectedTagIds.join(', ')}</div>
      </div>
    );
  };
});

jest.mock('../../components/UserSelector', () => {
  return function MockUserSelector({ selectedUserId, onChange }: { selectedUserId: string, onChange: (userId: string) => void }) {
    return (
      <div data-testid="user-selector">
        <select
          value={selectedUserId}
          onChange={(e) => onChange(e.target.value)}
          data-testid="user-select"
        >
          <option value="">Select User</option>
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
        </select>
      </div>
    );
  };
});

jest.mock('../../utils/supabaseTags', () => ({
  getTagsForTask: jest.fn().mockResolvedValue([
    { id: 'tag1', name: 'Frontend' },
    { id: 'tag2', name: 'Bug' }
  ])
}));

describe('TaskForm', () => {
  const mockFormData = {
    title: '',
    description: '',
    due_date: '',
    priority: '',
    status: 'open',
    assigned_to: ''
  };

  const mockEditingTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'in_progress',
    priority: 'High',
    project_id: 'project1',
    created_by: 'user1',
    created_at: '2024-05-22T12:00:00Z',
    updated_at: '2024-05-22T12:00:00Z',
    assigned_to: 'user1',
    due_date: '2024-06-22'
  };

  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockHandleInputChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create form with empty values', async () => {
    await act(async () => {
      render(
      <TaskForm
        formData={mockFormData}
        editingTask={null}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handleInputChange={mockHandleInputChange}
      />
      );
    });

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
  });

  it('renders edit form with task values', async () => {
    const editFormData = {
      ...mockFormData,
      title: mockEditingTask.title,
      description: mockEditingTask.description || '',
      status: mockEditingTask.status,
      priority: mockEditingTask.priority,
      due_date: mockEditingTask.due_date || '',
      assigned_to: mockEditingTask.assigned_to || ''
    };

    await act(async () => {
      render(
      <TaskForm
        formData={editFormData}
        editingTask={mockEditingTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handleInputChange={mockHandleInputChange}
      />
      );
    });

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toHaveValue(mockEditingTask.title);
    expect(screen.getByLabelText('Description')).toHaveValue(mockEditingTask.description);
  });

  it('calls handleInputChange when inputs change', async () => {
    await act(async () => {
      render(
      <TaskForm
        formData={mockFormData}
        editingTask={null}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handleInputChange={mockHandleInputChange}
      />
      );
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Title *'), {
        target: { name: 'title', value: 'New Task Title' }
      });
    });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('calls onSubmit with selected tags when form is submitted', async () => {
    const mockSubmitPromise = Promise.resolve();
    mockOnSubmit.mockImplementation(() => mockSubmitPromise);

    const { container } = render(
      <TaskForm
        formData={mockFormData}
        editingTask={null}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handleInputChange={mockHandleInputChange}
      />
    );

    // Select tags using the mock TagSelector
    fireEvent.click(screen.getByText('Select Tags'));

    // Submit the form using screen.getByRole
    const form = screen.getByRole('form');
    
    await act(async () => {
      fireEvent.submit(form);
      await mockSubmitPromise;
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.any(Object),
      ['tag1', 'tag2']
    );
  });

  it('calls onCancel when cancel button is clicked', async () => {
    await act(async () => {
      render(
      <TaskForm
        formData={mockFormData}
        editingTask={null}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handleInputChange={mockHandleInputChange}
      />
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('loads existing tags when editing a task', async () => {
    await act(async () => {
      render(
      <TaskForm
        formData={mockFormData}
        editingTask={mockEditingTask}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        handleInputChange={mockHandleInputChange}
      />
      );
    });

    expect(await screen.findByText('Selected Tags: tag1, tag2')).toBeInTheDocument();
  });
});
