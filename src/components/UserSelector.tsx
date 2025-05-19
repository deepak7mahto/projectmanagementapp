import React, { useEffect, useState } from 'react';
// import removed: fetching from API route instead

interface Profile {
  id: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
}

interface UserSelectorProps {
  selectedUserId: string;
  onChange: (userId: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ selectedUserId, onChange }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/user-list');
        if (!res.ok) throw new Error('Failed to fetch user list');
        const data = await res.json();
        setProfiles(data);
        setError('');
      } catch (err) {
        console.error('Error fetching user list:', err);
        setError('Failed to load user profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchUserList();
  }, []);

  return (
    <div>
      <label htmlFor="assigned_to" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Assigned To</label>
      
      {loading ? (
        <select 
          id="assigned_to"
          name="assigned_to"
          disabled
          style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
        >
          <option>Loading users...</option>
        </select>
      ) : error ? (
        <div>
          <select 
            id="assigned_to"
            name="assigned_to"
            disabled
            style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
          >
            <option>Error loading users</option>
          </select>
          <p style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{error}</p>
        </div>
      ) : (
        <select
          id="assigned_to"
          name="assigned_to"
          value={selectedUserId}
          onChange={(e) => onChange(e.target.value)}
          style={{ display: 'block', width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
        >
          <option value="">Select a user</option>
          {profiles.map(profile => (
            <option key={profile.id} value={profile.id}>
              {profile.full_name && profile.email
                ? `${profile.full_name} (${profile.email})`
                : profile.full_name || profile.email || profile.id
              }
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default UserSelector;
