import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Our shared Navbar will persist across all pages */}
      <Navbar />
      
      {/* The Outlet acts as a window where the child routes will be injected */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* Our shared Footer will persist across all pages */}
      <Footer />
    </div>
  );
};

export default MainLayout;
