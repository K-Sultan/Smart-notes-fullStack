import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLogout } from './redux/authSlice';
import { Moon, Sun, LogOut, BookText, User } from 'lucide-react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NoteDetails from './pages/NoteDetails';
import NoteForm from './pages/NoteForm';
import Profile from './pages/Profile';
import './App.css';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <BookText size={28} className="text-primary" style={{ color: 'var(--primary-color)' }} />
          Smart Notes
        </Link>
        <div className="navbar-links">
          {isAuthenticated && (
            <>
              <Link to="/profile" className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none' }}>
                <User size={18} /> Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none', color: 'var(--danger-color)' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
          <button onClick={toggleTheme} className="theme-toggle btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/notes/new" element={<ProtectedRoute><NoteForm /></ProtectedRoute>} />
          <Route path="/notes/:id/edit" element={<ProtectedRoute><NoteForm /></ProtectedRoute>} />
          <Route path="/notes/:id" element={<ProtectedRoute><NoteDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
