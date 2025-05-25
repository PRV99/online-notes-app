import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NotesList from './pages/NotesList';
import AddNote from './pages/AddNote';
import EditNotePage from './pages/EditNote';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/notes" : "/login"} />} />
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/notes" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isLoggedIn ? <Navigate to="/notes" /> : <Register />} 
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-note"
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-note/:id"
          element={
            <ProtectedRoute>
              <EditNotePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;