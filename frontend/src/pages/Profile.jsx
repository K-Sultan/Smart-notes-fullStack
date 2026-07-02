import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import API from '../api/axios';
import { Mail, Calendar, Hash } from 'lucide-react';

const Profile = () => {
  const user = useSelector(state => state.auth.user);

  const { data: userStats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      // Assuming GET /notes returns all notes for the user, we can count them
      const response = await API.get('/notes');
      const notes = response.data;
      return {
        total: notes.length,
        active: notes.filter(n => n.status === 'active').length,
        archived: notes.filter(n => n.status === 'archived').length,
      };
    }
  });

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Profile</h1>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>{user?.name}</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', margin: 0 }}>
              <Mail size={16} /> {user?.email}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Statistics</h3>
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div style={{ backgroundColor: 'var(--background-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{userStats?.total || 0}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Notes</div>
              </div>
              <div style={{ backgroundColor: 'var(--background-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{userStats?.active || 0}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Notes</div>
              </div>
              <div style={{ backgroundColor: 'var(--background-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{userStats?.archived || 0}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Archived</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
