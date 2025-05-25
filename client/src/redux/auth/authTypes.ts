export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}