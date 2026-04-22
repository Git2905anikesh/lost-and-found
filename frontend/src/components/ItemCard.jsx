import { Link } from 'react-router-dom';

const ItemCard = ({ item, type }) => {
  // Use a default placeholder image if the user didn't upload one
  const imageUrl = item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image+Available';
  
  // Figure out the date string based on the item type, then format it nicely
  const dateStr = item.dateLost || item.dateFound;
  const dateFormatted = new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isLost = type === 'lost';
  const badgeColor = isLost ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full group">
      {/* Image Section */}
      <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        {/* Floating Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${badgeColor}`}>
          {isLost ? 'Lost' : 'Found'}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-1 mb-1" title={item.title}>
          {item.title}
        </h3>
        
        <p className="text-sm font-semibold text-blue-600 mb-4">{item.category}</p>

        <div className="space-y-2 mt-auto mb-6">
          {/* Location Row */}
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="line-clamp-1">{item.location}</span>
          </div>
          
          {/* Date Row */}
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {isLost ? 'Lost on ' : 'Found on '}{dateFormatted}
          </div>
        </div>

        <Link 
          to={`/${type}-items/${item._id}`}
          className="w-full text-center py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-blue-600 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
