import React, { useEffect, useState } from 'react';
import { getAllTags } from '../utils/supabaseTags';

interface Tag {
  id: string;
  name: string;
}

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTagIds, onChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const tagsData = await getAllTags();
        setTags(tagsData);
        setError('');
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    
    onChange(newSelectedTags);
  };

  return (
    <div>
      <label htmlFor="tags" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Tags</label>
      
      {loading ? (
        <div>Loading tags...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {tags.map(tag => (
            <div 
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              style={{
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: 14,
                backgroundColor: selectedTagIds.includes(tag.id) ? '#0070f3' : '#f0f0f0',
                color: selectedTagIds.includes(tag.id) ? 'white' : '#333',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
