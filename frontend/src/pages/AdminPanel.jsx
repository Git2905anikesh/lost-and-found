import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({
    users: [],
    lostItems: [],
    foundItems: [],
    claims: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Hard Security Redirect: If user is logged in but NOT an admin, kick them to the homepage immediately.
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Execute all 4 admin fetches concurrently for maximum speed
      const [usersRes, lostRes, foundRes, claimsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/lost-items'),
        api.get('/admin/found-items'),
        api.get('/admin/claims')
      ]);

      setData({
        users: usersRes.data,
        lostItems: lostRes.data,
        foundItems: foundRes.data,
        claims: claimsRes.data
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch admin data. Are you sure you have administrative privileges?');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt fetch if we are absolutely sure the user is an admin
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // Admin Delete Function
  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`Are you absolutely sure you want to delete this ${type} item? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/${type}-items/${id}`);
      
      // Update the local state to remove the item immediately from the UI
      setData(prev => ({
        ...prev,
        [`${type}Items`]: prev[`${type}Items`].filter(item => item._id !== id)
      }));
    } catch (err) {
      alert(`Failed to delete ${type} item`);
    }
  };

  // Prevent rendering if user context is still loading
  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 text-red-600 p-8 rounded-3xl border border-red-200 mt-10 shadow-sm text-center">
        <span className="text-6xl mb-4 block">⛔</span>
        <h2 className="text-3xl font-extrabold mb-2">Access Denied</h2>
        <p className="font-medium text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b pb-6 border-gray-200">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">System Control Panel</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and moderate all users, items, and claims.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Vertical Admin Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <h3 className="font-extrabold text-lg uppercase tracking-wider">Database Metrics</h3>
            </div>
            <nav className="p-4 space-y-2">
              <button onClick={() => setActiveTab('users')} className={`w-full flex justify-between items-center px-5 py-4 font-bold rounded-2xl transition ${activeTab === 'users' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                <span>👥 Registered Users</span>
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">{data.users.length}</span>
              </button>
              <button onClick={() => setActiveTab('lostItems')} className={`w-full flex justify-between items-center px-5 py-4 font-bold rounded-2xl transition ${activeTab === 'lostItems' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                <span>🔍 Lost Items</span>
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">{data.lostItems.length}</span>
              </button>
              <button onClick={() => setActiveTab('foundItems')} className={`w-full flex justify-between items-center px-5 py-4 font-bold rounded-2xl transition ${activeTab === 'foundItems' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                <span>🎁 Found Items</span>
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">{data.foundItems.length}</span>
              </button>
              <button onClick={() => setActiveTab('claims')} className={`w-full flex justify-between items-center px-5 py-4 font-bold rounded-2xl transition ${activeTab === 'claims' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>
                <span>📝 System Claims</span>
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">{data.claims.length}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Dynamic Content Display */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[600px]">
            
            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">User Management</h2>
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-widest text-xs">
                      <tr>
                        <th className="px-6 py-5 font-bold">User Name</th>
                        <th className="px-6 py-5 font-bold">Email Address</th>
                        <th className="px-6 py-5 font-bold">Role</th>
                        <th className="px-6 py-5 font-bold">Date Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-5 font-bold text-gray-900">{u.name}</td>
                          <td className="px-6 py-5 text-gray-600 font-medium">{u.email}</td>
                          <td className="px-6 py-5">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>{u.role}</span>
                          </td>
                          <td className="px-6 py-5 text-gray-500 font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LOST ITEMS TAB */}
            {activeTab === 'lostItems' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Lost Item Moderation</h2>
                <div className="grid gap-5">
                  {data.lostItems.map(item => (
                    <div key={item._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-red-200 hover:shadow-md transition">
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-extrabold text-xl text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-sm font-medium text-gray-500">Posted by: <span className="text-gray-800">{item.user?.name}</span> ({item.user?.email})</p>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest mt-3 bg-red-100 inline-block px-3 py-1 rounded-full">Status: {item.status}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteItem('lost', item._id)}
                        className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-sm w-full md:w-auto"
                      >
                        Force Delete
                      </button>
                    </div>
                  ))}
                  {data.lostItems.length === 0 && <p className="text-center text-gray-500 py-10 font-medium">No lost items in the database.</p>}
                </div>
              </div>
            )}

            {/* FOUND ITEMS TAB */}
            {activeTab === 'foundItems' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Found Item Moderation</h2>
                <div className="grid gap-5">
                  {data.foundItems.map(item => (
                    <div key={item._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-green-200 hover:shadow-md transition">
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-extrabold text-xl text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-sm font-medium text-gray-500">Posted by: <span className="text-gray-800">{item.user?.name}</span> ({item.user?.email})</p>
                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mt-3 bg-green-100 inline-block px-3 py-1 rounded-full">Status: {item.status}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteItem('found', item._id)}
                        className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-sm w-full md:w-auto"
                      >
                        Force Delete
                      </button>
                    </div>
                  ))}
                  {data.foundItems.length === 0 && <p className="text-center text-gray-500 py-10 font-medium">No found items in the database.</p>}
                </div>
              </div>
            )}

            {/* CLAIMS TAB */}
            {activeTab === 'claims' && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Global Claims Overview</h2>
                <div className="grid gap-5">
                  {data.claims.map(claim => (
                    <div key={claim._id} className="p-8 bg-gray-50 rounded-3xl border border-gray-200">
                      <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                        <div>
                          <h3 className="font-extrabold text-xl text-gray-800">Claim on {claim.itemType}</h3>
                          <p className="text-sm font-medium text-gray-500 mt-1">Submitted by: <span className="text-gray-800">{claim.claimedBy?.name}</span></p>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm border ${
                          claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          claim.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mb-2">Attached Proof Message:</p>
                        <p className="text-gray-700 italic bg-white p-5 rounded-2xl border border-gray-200 shadow-inner">"{claim.message}"</p>
                      </div>
                    </div>
                  ))}
                  {data.claims.length === 0 && <p className="text-center text-gray-500 py-10 font-medium">No claims submitted yet.</p>}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
