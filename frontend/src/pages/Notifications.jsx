import { useState, useEffect } from 'react';
import api from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      // Update state locally immediately for a snappy UI
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
    
    try {
      // Process all API calls concurrently
      await Promise.all(unreadIds.map(id => api.put(`/notifications/${id}/read`)));
      // Update UI
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
      setError('Failed to mark all as read. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Your Inbox</h1>
          <p className="text-gray-600 mt-1">You have <strong className={unreadCount > 0 ? "text-red-500" : ""}>{unreadCount} unread</strong> message{unreadCount !== 1 ? 's' : ''}.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-bold text-blue-600 hover:text-blue-800 transition px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 shadow-sm"
          >
            Mark all as read ✓
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-medium">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
          <span className="text-7xl mb-4 text-gray-200">📭</span>
          <h3 className="text-2xl font-bold text-gray-700">Your inbox is empty</h3>
          <p className="text-gray-500 mt-2 max-w-sm">When the AI finds a match or your claim is updated, you'll be notified here immediately.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`p-6 rounded-3xl border transition-all duration-300 ${
                notification.isRead 
                  ? 'bg-white border-gray-100 shadow-sm opacity-80' 
                  : 'bg-blue-50 border-blue-200 shadow-md transform hover:-translate-y-1 relative'
              }`}
            >
              {/* Unread indicator dot */}
              {!notification.isRead && (
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-sm animate-pulse"></div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="pr-4">
                  <h3 className={`text-xl mb-1 ${notification.isRead ? 'font-bold text-gray-700' : 'font-extrabold text-blue-900'}`}>
                    {notification.title}
                  </h3>
                  <p className={`mb-4 leading-relaxed ${notification.isRead ? 'text-gray-600' : 'text-blue-800 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                
                {!notification.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="flex-shrink-0 text-sm bg-white px-5 py-2.5 rounded-xl border-2 border-blue-200 text-blue-600 font-bold shadow-sm hover:bg-blue-100 transition whitespace-nowrap"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
