import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import { useStore } from './store/useStore';
import './App.css';
import './styles/landing.css';

function App() {
  const { auth } = useStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected Routes */}
        <Route
          path="/schedule"
          element={auth.isAuthenticated ? <Layout /> : <Navigate to="/auth" replace />}
        >
          <Route index element={<Schedule />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="courses" element={<Courses />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
