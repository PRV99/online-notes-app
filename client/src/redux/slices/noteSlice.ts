import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Note, NoteState } from '../notes/noteTypes'; // Adjust the import path as necessary
import noteService from '../../services/noteService';
import { NoteFormInput } from '../../components/NoteForm'; // Adjust the import path as necessary

const initialState: NoteState = {
  notes: [],
  loading: false,
  error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetch', async (_, thunkAPI) => {
  try {
    return await noteService.getNotes();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetch failed');
  }
});

export const createNote = createAsyncThunk('notes/create', async (data: { title: string; content: string }, thunkAPI) => {
  try {
    return await noteService.createNote(data);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Create failed');
  }
});

export const deleteNote = createAsyncThunk('notes/delete', async (id: string, thunkAPI) => {
  try {
    await noteService.deleteNote(id);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});

export const updateNote = createAsyncThunk('notes/update', async (data: { id: string; updatedData: NoteFormInput }, thunkAPI) => {
    try {
      return await noteService.updateNote(data.id, data.updatedData);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

export const fetchNoteById = createAsyncThunk('notes/edit', async (id: string, thunkAPI) => {
    try {
      return await noteService.getNoteById(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch failed');
    }
  }
);

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload); // add to top
      })
      .addCase(createNote.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((note) => note._id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default noteSlice.reducer;