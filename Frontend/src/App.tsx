// App.tsx
import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import MedicineManagement from './pages/admin/MedicineManagement';
import PatientRegistration from './pages/admin/PatientRegistration';
import AllPatients from './pages/admin/AllPatients';
import DoctorDashboard from './pages/doctor/Dashboard';
import PrescriptionForm from './pages/doctor/PrescriptionForm';
import Login from './pages/Login';
import { getUser } from './utils/auth';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role || '')) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <DoctorManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/medicines"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <MedicineManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <PatientRegistration />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/all-patients"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AllPatients />
            </PrivateRoute>
          }
        />

        {/* Doctor routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/prescription/:id"
          element={
            <PrivateRoute allowedRoles={['doctor']}>
              <PrescriptionForm />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={getUser()?.role === 'doctor' ? '/doctor/dashboard' : '/admin/dashboard'} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
