import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'lost', label: 'My Lost Items', icon: '🔍' },
    { id: 'found', label: 'My Found Items', icon: '🎁' },
    { id: 'matches', label: 'AI Matches', icon: '🤖' },
    { id: 'claims', label: 'My Claims', icon: '📝' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden sticky top-24">
      {/* Profile Header Section */}
      <div className="p-8 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-black mb-4 shadow-inner">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-xl font-extrabold text-gray-800">{user?.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
        <span className="px-4 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
          {user?.role}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-4 text-xl">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50">
        <Link 
          to="/report-lost"
          className="w-full flex justify-center items-center px-4 py-3 bg-white border-2 border-blue-600 text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition"
        >
          + Report New Item
        </Link>
        <button 
          onClick={logout}
          className="w-full flex justify-center items-center px-4 py-3 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition"
        >
          Secure Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
