import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/axios';
import { ArrowLeft, Save } from 'lucide-react';

const noteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('active'),
});

const NoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      status: 'active'
    }
  });

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const response = await API.get(`/notes/${id}`);
      return response.data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content || '',
        category: note.category || '',
        status: note.status || 'active',
      });
    }
  }, [note, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEditing) {
        return await API.patch(`/notes/${id}`, data);
      } else {
        return await API.post('/notes', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
      queryClient.invalidateQueries(['note', id]);
      navigate('/dashboard');
    },
    onError: (error) => {
      setServerError(error.response?.data?.message || "Something went wrong.");
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isEditing && isLoading) {
    return <div className="spinner"></div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-outline" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 style={{ margin: 0 }}>{isEditing ? 'Edit Note' : 'Create Note'}</h1>
      </div>

      <div className="card">
        {serverError && (
          <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <input 
              type="text" 
              id="title" 
              placeholder="Note title" 
              {...register('title')}
            />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <input 
              type="text" 
              id="category" 
              placeholder="e.g. Work, Personal, Ideas" 
              {...register('category')}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">Status</label>
            <select id="status" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="content">Content</label>
            <textarea 
              id="content" 
              rows="10" 
              placeholder="Write your note here..." 
              {...register('content')}
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/dashboard" className="btn btn-outline">Cancel</Link>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting || mutation.isPending}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              {mutation.isPending ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : <Save size={18} />}
              {isEditing ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
