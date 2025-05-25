import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchNotes, deleteNote } from '../redux/slices/noteSlice';
import { Note } from '../redux/notes/noteTypes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import { FiTrash2 } from 'react-icons/fi';

const NotesList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);

  const [modalOpen, setModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const openConfirmModal = (id: string) => {
    setNoteToDelete(id);
    setModalOpen(true);
  };

  const closeConfirmModal = () => {
    setNoteToDelete(null);
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await dispatch(deleteNote(noteToDelete)).unwrap();
      toast.success('Note deleted!');
      dispatch(fetchNotes());
    } catch {
      toast.error('Failed to delete note');
    } finally {
      closeConfirmModal();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/add-note')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Note
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Your Notes</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-center text-gray-500">No notes yet. Start creating!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {notes.map((note: Note) => (
            <div
              key={note._id}
              className="bg-white shadow-md p-4 rounded-xl border hover:shadow-lg transition duration-200 relative cursor-pointer"
              onClick={() => navigate(`/edit-note/${note._id}`)}
            >
              <button
                onClick={e => { e.stopPropagation(); openConfirmModal(note._id); }}
                aria-label="Delete note"
                className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition"
              >
                <FiTrash2 size={20} />
              </button>

              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">{note.content}</p>
              <p className="mt-4 text-sm text-gray-400">
                Updated: {new Date(note.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={modalOpen}
        message="Are you sure you want to delete this note?"
        onConfirm={confirmDelete}
        onCancel={closeConfirmModal}
      />
    </div>
  );
};

export default NotesList;