import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ReporterHome from '../pages/reporter/ReporterHome';
import ReportAnimal from '../pages/reporter/ReportAnimal';
import ReportHistory from '../pages/reporter/ReportHistory';
import LiveTracking from '../pages/reporter/LiveTracking';
import VolunteerDashboard from '../pages/volunteer/VolunteerDashboard';
import Navigation from '../pages/volunteer/Navigation';
import { useAuth } from '../context/AuthContext';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route 
        path="/report-home" 
        element={user?.role === 'reporter' ? <ReporterHome /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/report" 
        element={user?.role === 'reporter' ? <ReportAnimal /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/report-history" 
        element={user?.role === 'reporter' ? <ReportHistory /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/track/:id" 
        element={user ? <LiveTracking /> : <Navigate to="/login" />} 
      />

      <Route 
        path="/dashboard" 
        element={user?.role === 'volunteer' ? <VolunteerDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/navigate/:id" 
        element={user?.role === 'volunteer' ? <Navigation /> : <Navigate to="/login" />} 
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
