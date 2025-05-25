import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from '../components/NoteForm';

const AddNote: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Add a New Note</h1>
      <NoteForm
        onSuccess={() => {
          navigate('/notes'); // Redirect after successful creation
        }}
      />
    </div>
  );
};

export default AddNote;