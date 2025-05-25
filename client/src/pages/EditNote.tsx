import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { updateNote, fetchNotes, fetchNoteById } from '../redux/slices/noteSlice';
import NoteForm, { NoteFormInput } from '../components/NoteForm';
import { toast } from 'react-toastify';
import { Note } from '../redux/notes/noteTypes';

const EditNotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const noteFromState = useSelector((state: RootState) =>
    state.notes.notes.find((n) => n._id === id)
  );
  const [note, setNote] = useState<Note | null>(noteFromState || null);
  const [loading, setLoading] = useState(!noteFromState);

  useEffect(() => {
    if (!noteFromState && id) {
      setLoading(true);
      dispatch(fetchNoteById(id))
        .unwrap()
        .then(setNote)
        .catch(() => toast.error('Note not found or failed to fetch'))
        .finally(() => setLoading(false));
    }
  }, [id, dispatch, noteFromState]);

  const handleUpdate = async (data: NoteFormInput) => {
    try {
      await dispatch(updateNote({ id: id!, updatedData: data })).unwrap();
      toast.success('Note updated!');
      await dispatch(fetchNotes());
      navigate('/notes');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading note...</p>;
  if (!note) return <p className="text-center text-red-500">Note not found</p>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Note</h1>
      <NoteForm
        initialData={{
          title: note.title,
          content: (note.content ?? note.description ?? ''), // Map description to content if needed
          tag: typeof note.tag === 'string' ? note.tag : undefined,
        }}
        onSubmitHandler={handleUpdate}
      />
    </div>
  );
};

export default EditNotePage;