import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const ItemDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // We can dynamically determine if we are viewing a lost or found item based on the URL route
  const isLost = location.pathname.includes('/lost-items');
  const typeStr = isLost ? 'lost' : 'found';

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim Form State
  const [claimMessage, setClaimMessage] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await api.get(`/${typeStr}/${id}`);
        setItem(response.data);
      } catch (err) {
        setError(`Failed to load ${typeStr} item details.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [id, typeStr]);

  const handleClaim = async (e) => {
    e.preventDefault();
    
    // Safety check just in case
    if (!user) {
      return navigate('/login');
    }

    setIsSubmittingClaim(true);
    setClaimError('');
    setClaimSuccess('');

    try {
      await api.post('/claims', {
        itemType: isLost ? 'LostItem' : 'FoundItem',
        itemId: id,
        message: claimMessage
      });
      setClaimSuccess('Claim submitted successfully! You can track it in your dashboard.');
      setClaimMessage('');
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error || 'Item not found'}</p>
      </div>
    );
  }

  // Formatting variables
  const imageUrl = item.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image+Available';
  const badgeColor = isLost ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200';
  const dateStr = item.dateLost || item.dateFound;
  const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Check if the current logged-in user is the one who posted this item
  const isOwner = user && item.user && (item.user._id === user._id || item.user === user._id);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Item Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Image Side */}
          <div className="md:w-1/2 h-72 md:h-auto bg-gray-100 relative">
            <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
            <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-md border ${badgeColor}`}>
              {isLost ? 'Lost Item' : 'Found Item'}
            </div>
            {item.status === 'resolved' && (
              <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-md bg-gray-800 text-white">
                Resolved
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="md:w-1/2 p-8 lg:p-10 flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">{item.category}</span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{item.title}</h1>
            
            <p className="text-gray-600 leading-relaxed mb-8">
              {item.description}
            </p>

            <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-8 text-sm bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div>
                <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">Date {isLost ? 'Lost' : 'Found'}</p>
                <p className="font-bold text-gray-800">{formattedDate}</p>
              </div>
              
              <div>
                <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">Location</p>
                <p className="font-bold text-gray-800">{item.location}</p>
              </div>

              {item.color && (
                <div>
                  <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">Color</p>
                  <p className="font-bold text-gray-800">{item.color}</p>
                </div>
              )}

              {item.brand && (
                <div>
                  <p className="text-gray-400 mb-1 text-xs uppercase tracking-wider font-semibold">Brand</p>
                  <p className="font-bold text-gray-800">{item.brand}</p>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Contact / Instructions</p>
              <p className="font-medium text-gray-800">{item.contactInfo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Claim Section */}
      {/* We only show the claim box if: 1. You aren't the owner 2. The item isn't resolved */}
      {!isOwner && item.status !== 'resolved' && (
        <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Is this your item?
          </h2>
          <p className="text-gray-600 mb-6">
            Submit a claim to contact the person who posted this. Please provide proof of ownership in your message (e.g., exact contents, specific scratches, passwords).
          </p>

          {claimSuccess && <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 border border-green-200 font-medium">{claimSuccess}</div>}
          {claimError && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200 font-medium">{claimError}</div>}

          {!user ? (
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-blue-800 text-center">
              <p className="mb-2 text-lg">You must log in to submit a claim.</p>
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Log In Now
              </button>
            </div>
          ) : (
            <form onSubmit={handleClaim}>
              <textarea
                required
                rows="4"
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                placeholder="Describe your proof of ownership here in detail..."
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none mb-4 resize-none bg-gray-50"
              ></textarea>
              <button 
                type="submit" 
                disabled={isSubmittingClaim}
                className={`px-8 py-3.5 rounded-xl text-white font-bold transition ${isSubmittingClaim ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
              >
                {isSubmittingClaim ? 'Submitting Claim...' : 'Submit Claim'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
