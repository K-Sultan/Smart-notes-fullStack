import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { setLogin } from '../redux/authSlice';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const response = await API.post('/auth/login', data);
      
      // Dispatch to Redux
      dispatch(setLogin({
        user: response.data.user,
        token: response.data.token
      }));
      
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container card">
      <h2 className="auth-title">Welcome Back</h2>
      
      {serverError && (
        <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            placeholder="you@example.com" 
            {...register('email')}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••" 
            {...register('password')}
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="spinner" style={{ width: '20px', height: '20px', borderLeftColor: 'white' }}></span> : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register">Create one</Link>
      </div>
    </div>
  );
};

export default Login;
