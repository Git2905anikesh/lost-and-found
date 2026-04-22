const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <span className="text-xl font-bold text-gray-800 tracking-tight">AI Lost & Found</span>
            <p className="text-sm text-gray-500 mt-1">Smart matching system for your misplaced items.</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition text-sm">About Us</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition text-sm">Terms of Service</a>
          </div>
          
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AI Lost & Found System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
