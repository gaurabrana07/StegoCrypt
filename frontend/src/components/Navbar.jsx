import { Link, useLocation } from 'react-router-dom';
import { FaLock, FaImage, FaEye } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-cyber-darker border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <FaLock className="text-purple-500 text-2xl group-hover:animate-pulse" />
            <span className="text-2xl font-bold text-white">
              Stego<span className="text-purple-500">Crypt</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
              }`}
            >
              <FaLock />
              <span>Home</span>
            </Link>

            <Link
              to="/encode"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/encode')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
              }`}
            >
              <FaImage />
              <span>Encode</span>
            </Link>

            <Link
              to="/decode"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/decode')
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
              }`}
            >
              <FaEye />
              <span>Decode</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
