import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './components/Layout';
import Calendar from './pages/Calendar';
import Curriculum from './pages/Curriculum';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import './App.css';
import './styles/landing.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page route */}
        <Route path="/" element={<Landing />} />
        
        {/* Main application routes */}
        <Route element={<Layout />}>
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/curriculum" element={<Curriculum />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
