import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import './App.css';
import './styles/landing.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/schedule" element={<Layout />}>
          <Route index element={<Schedule />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="courses" element={<Courses />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/schedule/schedule" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
