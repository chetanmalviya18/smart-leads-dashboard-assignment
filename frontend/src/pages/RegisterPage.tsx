import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/ui';
import { getErrorMessage } from '../services/api';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ defaultValues: { role: 'sales' } });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success('Account created! Welcome to SmartLeads.');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-gray-900 dark:text-white">SmartLeads</span>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">Create account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Get started with SmartLeads today.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                })}
                className="input-base"
                placeholder="Your full name"
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
                type="email"
                className="input-base"
                placeholder="you@example.com"
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Min 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must include uppercase, lowercase & number',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input-base pr-10"
                  placeholder="Min 8 characters"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select {...register('role')} className="input-base" disabled={isLoading}>
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={isLoading}>
              {isLoading && <Spinner size={16} className="text-white" />}
              Create Account
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
