import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/matches/my');
        setMatches(response.data);
      } catch (err) {
        setError('Failed to load AI matches. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center mt-10">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-800">Your AI Matches</h1>
        <p className="text-lg text-gray-600 mt-3">
          Our algorithm has found these potential connections between your reported items and others in the system.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
          <span className="text-7xl mb-6 text-blue-200">🤖</span>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No matches found yet</h3>
          <p className="text-gray-500 max-w-md">
            Our AI runs continuously in the background. As soon as someone reports a similar item, it will appear here.
          </p>
          <Link to="/dashboard" className="mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md">
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {matches.map((match) => (
            <div key={match._id} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition duration-300">
              
              {/* Score Section */}
              <div className="md:w-1/4 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-100">
                <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-white shadow-inner border-4 border-blue-100">
                  <span className="text-4xl font-black text-blue-600">{match.score}%</span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-blue-800 uppercase tracking-widest">Similarity Score</h3>
              </div>

              {/* Details Section */}
              <div className="md:w-3/4 p-8 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-3">AI Analysis Summary</h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100 italic mb-6">
                  "{match.summary}"
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-auto">
                  {/* Lost Item Summary */}
                  <div className="border border-red-100 rounded-2xl p-5 bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1 block">Lost Item Reported</span>
                    <h4 className="font-bold text-gray-800 text-lg mb-1 truncate">
                      {match.lostItem ? match.lostItem.title : 'Item Deleted'}
                    </h4>
                    {match.lostItem && (
                      <Link to={`/lost-items/${match.lostItem._id}`} className="text-sm font-semibold text-blue-600 hover:underline mt-2 inline-block">
                        View Full Details →
                      </Link>
                    )}
                  </div>

                  {/* Found Item Summary */}
                  <div className="border border-green-100 rounded-2xl p-5 bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1 block">Found Item Reported</span>
                    <h4 className="font-bold text-gray-800 text-lg mb-1 truncate">
                      {match.foundItem ? match.foundItem.title : 'Item Deleted'}
                    </h4>
                    {match.foundItem && (
                      <Link to={`/found-items/${match.foundItem._id}`} className="text-sm font-semibold text-blue-600 hover:underline mt-2 inline-block">
                        View Full Details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
