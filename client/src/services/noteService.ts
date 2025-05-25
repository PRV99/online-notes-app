import api from './api';
import { Note } from '../redux/notes/noteTypes';

export interface CreateNoteData {
  title: string;
  content: string;
}

// GET /notes - Get all notes
const getNotes = async (): Promise<Note[]> => {
  const response = await api.get<Note[]>('/notes');
  return response.data;
};

// POST /notes - Create a new note
const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>('/notes', data);
  return response.data;
};

// DELETE /notes/:id - Delete a note
const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

// GET /notes/:id - Get a single note
const getNote = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

// PUT /notes/:id - Update a note
const updateNote = async (id: string, data: CreateNoteData): Promise<Note> => {
  const response = await api.put<Note>(`/notes/${id}`, data);
  return response.data;
};

// GET /api/notes/:id - Get a note by ID
const getNoteById = async(id: string): Promise<Note> => {
  const response = await api.get(`/notes/${id}`);
	return response.data;
}

export default {
  getNotes,
  createNote,
	deleteNote,
	getNote,
	updateNote,
	getNoteById
};