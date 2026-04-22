import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import DashboardSidebar from '../components/DashboardSidebar';
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');

  // Unified State for all dashboard data
  const [myLostItems, setMyLostItems] = useState([]);
  const [myFoundItems, setMyFoundItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch absolutely everything when the dashboard loads
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [lostRes, foundRes, matchRes, claimRes, notifRes] = await Promise.all([
          api.get('/lost/user/me'),
          api.get('/found/user/me'),
          api.get('/matches/my'),
          api.get('/claims/my'),
          api.get('/notifications')
        ]);

        setMyLostItems(lostRes.data);
        setMyFoundItems(foundRes.data);
        setMatches(matchRes.data);
        setClaims(claimRes.data);
        setNotifications(notifRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      // Update local state to immediately show it as read
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  // Helper function to render the correct content based on the active tab state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[600px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Dashboard Overview</h2>
            
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition">
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-4xl font-black text-gray-800">{myLostItems.length}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Lost Items</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition">
                <span className="text-4xl mb-3">🎁</span>
                <p className="text-4xl font-black text-gray-800">{myFoundItems.length}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Found Items</p>
              </div>
              <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-md border border-blue-500 flex flex-col items-center justify-center transform hover:-translate-y-1 transition duration-300">
                <span className="text-4xl mb-3">🤖</span>
                <p className="text-4xl font-black">{matches.length}</p>
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mt-1">AI Matches</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition">
                <span className="text-4xl mb-3">🔔</span>
                <p className="text-4xl font-black text-red-500">{notifications.filter(n => !n.isRead).length}</p>
                <p className="text-xs font-bold text-red-300 uppercase tracking-widest mt-1">Unread Alerts</p>
              </div>
            </div>

            {/* Quick Summary Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Notifications Panel */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Recent Alerts</h3>
                  <button onClick={() => setActiveTab('notifications')} className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                </div>
                
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No notifications yet.</p>
                ) : (
                  <ul className="space-y-4">
                    {notifications.slice(0, 3).map(n => (
                      <li key={n._id} className={`p-4 rounded-xl text-sm transition ${n.isRead ? 'bg-gray-50 text-gray-500 border border-gray-100' : 'bg-blue-50 text-blue-900 border border-blue-100 shadow-sm'}`}>
                        <p className="font-bold mb-1">{n.title}</p>
                        <p className="opacity-90">{n.message}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Matches Panel */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Top Matches</h3>
                  <button onClick={() => setActiveTab('matches')} className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                </div>

                {matches.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">Our AI is still processing your items.</p>
                ) : (
                  <ul className="space-y-4">
                    {matches.slice(0, 3).map(m => (
                      <li key={m._id} className="p-4 border-2 border-green-100 bg-green-50 rounded-xl flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold text-green-800 text-lg mb-1">{m.score}% Match Found!</span>
                          <p className="text-sm text-green-700 line-clamp-1">{m.summary}</p>
                        </div>
                        <div className="text-3xl">🎉</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );

      case 'lost':
        return (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold text-gray-800">My Lost Items</h2>
              <Link to="/report-lost" className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition text-sm">+ Report Lost</Link>
            </div>
            
            {myLostItems.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <span className="text-6xl mb-4">🔍</span>
                <h3 className="text-xl font-bold text-gray-700">No lost items reported</h3>
                <p className="text-gray-500 mt-2 max-w-md">If you've lost something, report it now so our AI can start scanning for matches.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myLostItems.map(item => <ItemCard key={item._id} item={item} type="lost" />)}
              </div>
            )}
          </div>
        );

      case 'found':
        return (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold text-gray-800">My Found Items</h2>
              <Link to="/report-found" className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition text-sm">+ Report Found</Link>
            </div>

            {myFoundItems.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <span className="text-6xl mb-4">🎁</span>
                <h3 className="text-xl font-bold text-gray-700">No found items reported</h3>
                <p className="text-gray-500 mt-2 max-w-md">Found something lying around? Be a hero and report it to help someone out.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myFoundItems.map(item => <ItemCard key={item._id} item={item} type="found" />)}
              </div>
            )}
          </div>
        );

      case 'matches':
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">AI Match Results</h2>
            {matches.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <span className="text-6xl mb-4 text-blue-200">🤖</span>
                <h3 className="text-xl font-bold text-gray-700">No matches found... yet!</h3>
                <p className="text-gray-500 mt-2 max-w-md">Our algorithm runs continuously in the background. As soon as someone reports a similar item, it will show up here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {matches.map(m => (
                  <div key={m._id} className="bg-white p-8 rounded-3xl shadow-sm border-2 border-blue-50 hover:border-blue-200 transition flex flex-col md:flex-row gap-8 items-center">
                    {/* Score Circle */}
                    <div className="md:w-1/4 w-full flex flex-col items-center justify-center bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-inner">
                      <div className="text-5xl font-black text-blue-600">{m.score}%</div>
                      <div className="text-xs font-extrabold text-blue-400 uppercase tracking-widest mt-2">Similarity</div>
                    </div>
                    {/* Match Details */}
                    <div className="md:w-3/4 w-full flex flex-col">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">AI Summary</h4>
                      <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{m.summary}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-4">
                        <Link to={`/lost-items/${m.lostItem?._id}`} className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100">View Lost Item</Link>
                        <Link to={`/found-items/${m.foundItem?._id}`} className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100">View Found Item</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'claims':
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">My Claims Status</h2>
            {claims.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <span className="text-6xl mb-4 text-gray-200">📝</span>
                <h3 className="text-xl font-bold text-gray-700">No active claims</h3>
                <p className="text-gray-500 mt-2 max-w-md">When you find your lost item listed by someone else and click 'Submit Claim', it will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {claims.map(claim => (
                  <div key={claim._id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    {/* Decorative Color Bar on left edge based on status */}
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                      claim.status === 'pending' ? 'bg-yellow-400' :
                      claim.status === 'approved' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}></div>
                    
                    <div className="pl-4 flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">Claim for a {claim.itemType.replace('Item', '')}</h3>
                        <p className="text-sm text-gray-400 mt-1">Submitted on {new Date(claim.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        claim.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {claim.status}
                      </span>
                    </div>
                    
                    <div className="pl-4">
                      <p className="text-sm text-gray-500 font-bold mb-2 uppercase tracking-wide">Your Provided Proof:</p>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 italic leading-relaxed">"{claim.message}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'notifications':
        return (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold text-gray-800">Inbox & Alerts</h2>
            </div>
            {notifications.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <span className="text-6xl mb-4 text-gray-200">🔔</span>
                <h3 className="text-xl font-bold text-gray-700">You're all caught up!</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map(n => (
                  <div key={n._id} className={`p-6 rounded-2xl border transition-all ${n.isRead ? 'bg-white border-gray-100 shadow-sm' : 'bg-blue-50 border-blue-200 shadow-md relative'}`}>
                    
                    {!n.isRead && <div className="absolute -left-2 -top-2 w-5 h-5 bg-blue-600 rounded-full border-4 border-white animate-pulse"></div>}
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-lg ${n.isRead ? 'font-bold text-gray-700' : 'font-extrabold text-blue-900'}`}>{n.title}</h3>
                      
                      {!n.isRead && (
                        <button 
                          onClick={() => handleMarkAsRead(n._id)}
                          className="text-xs bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 font-bold shadow-sm hover:bg-blue-100 transition"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 leading-relaxed ${n.isRead ? 'text-gray-500' : 'text-blue-800 font-medium'}`}>{n.message}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Dynamic Interactive Sidebar */}
      <div className="md:w-1/4 md:min-w-[280px]">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Render Window */}
      <div className="md:w-3/4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
