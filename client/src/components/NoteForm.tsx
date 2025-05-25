import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AppDispatch } from '../redux/store';
import { createNote, fetchNotes } from '../redux/slices/noteSlice';

export type NoteFormInput = {
  title: string;
  content: string;
  tag?: string;
};

type NoteFormProps = {
  onSuccess?: () => void;
  initialData?: NoteFormInput;
  onSubmitHandler?: (data: NoteFormInput) => Promise<void>;
};

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  tag: Yup.string(),
});

const NoteForm: React.FC<NoteFormProps> = ({ onSuccess, initialData, onSubmitHandler }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormInput>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: initialData || { title: '', content: '' },
  });

  useEffect(() => {
    if (initialData) {
      // Sanitize initialData to ensure all fields are strings
      const sanitized = {
        title: initialData.title ?? '',
        content: initialData.content ?? '',
        tag: initialData.tag ?? '',
      };
      reset(sanitized);
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<NoteFormInput> = async (data) => {
    try {
      if (onSubmitHandler) {
        await onSubmitHandler(data);
      } else {
        await dispatch(createNote(data)).unwrap();
        toast.success('Note created successfully!');
        await dispatch(fetchNotes());
        reset();
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit note';
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Note' : 'Add Note'}
      </h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          {...register('title')}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          rows={4}
          {...register('content')}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Tag</label>
        <input
          type="text"
          {...register('tag')}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Note' : 'Create Note')}
      </button>
    </form>
  );
};

export default NoteForm;