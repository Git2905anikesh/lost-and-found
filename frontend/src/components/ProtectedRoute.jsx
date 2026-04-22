import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Show a loading spinner while checking local storage for the token
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If the user exists, render the child routes inside the Outlet. 
  // If not, redirect them forcefully to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
