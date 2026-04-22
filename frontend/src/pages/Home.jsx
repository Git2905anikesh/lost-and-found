import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-indigo-800 text-white py-20 lg:py-32 rounded-3xl overflow-hidden shadow-2xl mb-16">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative container mx-auto px-6 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Lost Something? <br className="hidden md:block" /> Let's Find It Together.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Our AI-powered platform matches lost and found items in your community instantly. Reconnect with what matters most.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/report-lost" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition transform duration-200"
            >
              Report Lost Item
            </Link>
            <Link 
              to="/report-found" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-700 transition transform duration-200"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      </section>

      {/* Action Cards Section */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Browse Recent Items</h2>
          <p className="text-gray-500 mt-2">Help your community by checking our latest listings.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Browse Lost Card */}
          <Link to="/lost-items" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-200 transition duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Browse Lost Items</h3>
            <p className="text-gray-600">See what your neighbors are looking for. You might have seen it!</p>
            <div className="mt-6 flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition-transform">
              View items <span className="ml-2">→</span>
            </div>
          </Link>

          {/* Browse Found Card */}
          <Link to="/found-items" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Browse Found Items</h3>
            <p className="text-gray-600">Did you lose something? Check if a kind stranger has already found it.</p>
            <div className="mt-6 flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
              View items <span className="ml-2">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 -mx-4 px-4 sm:-mx-8 sm:px-8 border-t border-gray-200 rounded-t-3xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why Use Our Platform?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition transform duration-300">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 text-xl">
                🤖
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">AI Smart Matching</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Our algorithm automatically compares descriptions, categories, and dates to instantly notify you of high-probability matches.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition transform duration-300">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 text-xl">
                🔒
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Secure Claims</h3>
              <p className="text-gray-600 text-sm leading-relaxed">We verify ownership through a robust claim and proof system, ensuring your valuable items are returned to the rightful owner safely.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition transform duration-300">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6 text-xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Instant Alerts</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Receive immediate in-app notifications and priority alerts the exact second a potential match is found for your reported item.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
