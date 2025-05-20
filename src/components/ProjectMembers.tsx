import React, { useEffect, useState } from 'react';
import { getProjectMembers, addProjectMember, removeProjectMember } from '../utils/supabaseProjectMembers';
import type { Member } from '../utils/supabaseProjectMembers';
import UserSelector from './UserSelector';

interface ProjectMembersProps {
  projectId: string;
}

const ProjectMembers: React.FC<ProjectMembersProps> = ({ projectId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addError, setAddError] = useState('');

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getProjectMembers(projectId);
      setMembers(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Add member
  const handleAddMember = async () => {
    if (!selectedUserId) return;
    setAdding(true);
    setAddError('');
    try {
      await addProjectMember(projectId, selectedUserId);
      setShowAdd(false);
      setSelectedUserId('');
      fetchMembers();
    } catch (err: any) {
      setAddError('Failed to add member: ' + (err.message || err));
    } finally {
      setAdding(false);
    }
  };

  // Remove member
  const handleRemove = async (userId: string) => {
    setRemovingId(userId);
    try {
      await removeProjectMember(projectId, userId);
      fetchMembers();
    } catch {
      // Optionally show error
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 24, marginBottom: 32, background: '#fafbfc' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>Team Members</h2>
        <button onClick={() => setShowAdd(true)} style={{ background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Add Member</button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: 24 }}>{error}</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {members.map(member => (
            <li key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16 }}>
                  {member.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{member.name}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>{member.role}</div>
                </div>
              </div>
              <button onClick={() => handleRemove(member.id)} disabled={removingId === member.id} style={{ background: '#ff4d4f', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 500, cursor: 'pointer', opacity: removingId === member.id ? 0.6 : 1 }}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {showAdd && (
        <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <UserSelector selectedUserId={selectedUserId} onChange={setSelectedUserId} />
          <button onClick={handleAddMember} disabled={adding || !selectedUserId} style={{ background: '#0070f3', color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', fontWeight: 500, cursor: 'pointer', opacity: adding ? 0.6 : 1 }}>Add</button>
          <button onClick={() => setShowAdd(false)} style={{ background: '#eee', color: '#444', border: 'none', borderRadius: 4, padding: '8px 12px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          {addError && <span style={{ color: 'red', marginLeft: 8 }}>{addError}</span>}
        </div>
      )}
    </div>
  );
};

export default ProjectMembers;
