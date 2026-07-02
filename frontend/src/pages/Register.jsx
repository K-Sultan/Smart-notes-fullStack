import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { setLogin } from '../redux/authSlice';
import { useState } from 'react';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Register = () => {
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const response = await API.post('/auth/register', data);
      
      // Dispatch to Redux to log in automatically after register
      dispatch(setLogin({
        user: response.data.user,
        token: response.data.token
      }));
      
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container card">
      <h2 className="auth-title">Create Account</h2>
      
      {serverError && (
        <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            placeholder="John Doe" 
            {...register('name')}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

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
          {isSubmitting ? <span className="spinner" style={{ width: '20px', height: '20px', borderLeftColor: 'white' }}></span> : 'Sign Up'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
