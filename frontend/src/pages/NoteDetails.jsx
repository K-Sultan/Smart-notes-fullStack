import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { ArrowLeft, Edit, Trash2, Calendar, Tag } from 'lucide-react';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const response = await API.get(`/notes/${id}`);
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await API.delete(`/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
      navigate('/dashboard');
    }
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger-color)' }}>
        Note not found or failed to load.
        <br />
        <Link to="/dashboard" style={{ marginTop: '1rem', display: 'inline-block' }}>Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/notes/${id}/edit`} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <Edit size={18} /> Edit
          </Link>
          <button 
            onClick={() => setShowConfirm(true)} 
            className="btn btn-danger" 
            style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem' }}
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--danger-color)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
          <h3 style={{ color: 'var(--danger-color)', marginTop: 0 }}>Delete Note</h3>
          <p>Are you sure you want to delete this note? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              className="btn btn-danger" 
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button className="btn btn-outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>{note.title}</h1>
            {note.status && (
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '16px', 
                backgroundColor: note.status === 'active' ? 'var(--secondary-color)' : 'var(--border-color)',
                color: note.status === 'active' ? 'white' : 'var(--text-color)',
                fontSize: '0.85rem',
                textTransform: 'capitalize'
              }}>
                {note.status}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} /> Created: {new Date(note.createdAt).toLocaleDateString()}
            </div>
            {note.category && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={16} /> {note.category}
              </div>
            )}
          </div>
        </div>

        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
          {note.content || <span style={{ color: 'var(--text-muted)' }}>No content</span>}
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
