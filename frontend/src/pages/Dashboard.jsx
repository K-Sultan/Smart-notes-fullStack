import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Search, Plus, Tag, Clock, BookText } from 'lucide-react';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const { data: notes = [], isLoading, isError } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await API.get('/notes');
      return response.data;
    }
  });

  const categories = [...new Set(notes.map(note => note.category).filter(Boolean))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory ? note.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Notes</h1>
        <Link to="/notes/new" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          <Plus size={20} /> New Note
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ flex: '0 1 200px' }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading notes...</p>
        </div>
      ) : isError ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger-color)' }}>
          Failed to load notes.
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <BookText size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>No notes found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {searchTerm || filterCategory ? "Try adjusting your search or filters." : "Create your first note to get started!"}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredNotes.map(note => (
            <Link to={`/notes/${note._id}`} key={note._id} className="card" style={{ display: 'flex', flexDirection: 'column', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {note.title}
                </h3>
                {note.status === 'archived' && (
                  <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--border-color)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Archived</span>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', flex: 1, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {note.content || "No content"}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }}>
                {note.category ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Tag size={14} /> {note.category}
                  </div>
                ) : <div></div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} /> {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
