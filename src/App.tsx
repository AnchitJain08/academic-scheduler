import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import NotFound from './pages/NotFound';
import './App.css';
import './styles/landing.css';

function App() {
  const BASE_URL = '/academic-scheduler';

  return (
    <Router basename={BASE_URL}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        
        {/* Main App Routes */}
        <Route path="/schedule" element={<Layout />}>
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
