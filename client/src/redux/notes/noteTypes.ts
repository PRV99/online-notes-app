export interface Note {
  _id: string;
  title: string;
  content: string;
  description?: string;
  createdAt: string;
  date: string;
  tag?: string;
}

export interface NoteState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}