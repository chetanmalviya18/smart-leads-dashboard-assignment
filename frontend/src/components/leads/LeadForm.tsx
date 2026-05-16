import { useForm } from 'react-hook-form';
import { Lead, CreateLeadPayload, LeadStatus, LeadSource } from '../../types';
import { Spinner } from '../ui';

interface LeadFormProps {
  defaultValues?: Partial<Lead>;
  onSubmit: (data: CreateLeadPayload) => void;
  isLoading: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export const LeadForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
  submitLabel = 'Save',
}: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeadPayload>({
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          email: defaultValues.email,
          status: defaultValues.status,
          source: defaultValues.source,
          notes: defaultValues.notes,
        }
      : { status: 'New' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name *
        </label>
        <input
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Min 2 characters' },
          })}
          className="input-base"
          placeholder="e.g. Rahul Sharma"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address *
        </label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
          })}
          type="email"
          className="input-base"
          placeholder="rahul@example.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="input-base"
            disabled={isLoading}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Source *
          </label>
          <select
            {...register('source', { required: 'Source is required' })}
            className="input-base"
            disabled={isLoading}
          >
            <option value="">Select source</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.source && (
            <p className="mt-1 text-xs text-red-500">{errors.source.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          {...register('notes', { maxLength: { value: 500, message: 'Max 500 characters' } })}
          className="input-base resize-none"
          rows={3}
          placeholder="Any additional notes about this lead..."
          disabled={isLoading}
        />
        {errors.notes && (
          <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading && <Spinner size={16} className="text-white" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
