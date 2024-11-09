import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';

const ProtectedRoute = ({ children, role }) => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  // Check if the token exists and whether the user is an admin or doctor
  if (role === 'admin' && !aToken) {
    return <Navigate to="/login" />;
  }
  if (role === 'doctor' && !dToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute