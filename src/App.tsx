import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Calendar from './pages/Calendar';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import Courses from './pages/Courses';

const App: React.FC = () => {
  const { student } = useStore();

  return (
    <Router>
      <Routes>
        {!student ? (
          <Route path="/" element={<Registration />} />
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/schedule" replace />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="courses" element={<Courses />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
