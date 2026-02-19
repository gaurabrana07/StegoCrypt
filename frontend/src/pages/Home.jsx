import { Link } from 'react-router-dom';
import { FaShieldAlt, FaImage, FaLock, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-6xl font-bold text-white mb-4">
            Stego<span className="text-purple-500">Crypt</span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Advanced Image Steganography with AES-256 Encryption
          </p>
          <p className="text-md text-gray-400">
            Hide your secrets in plain sight with military-grade encryption
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/50">
            <FaLock className="text-4xl text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">AES-256 Encryption</h3>
            <p className="text-gray-300">
              Military-grade encryption using PBKDF2 key derivation and CBC mode for maximum security.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/50">
            <FaImage className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">LSB Steganography</h3>
            <p className="text-gray-300">
              Hide data in image pixels using Least Significant Bit technique with zero visible distortion.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-xl p-6 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/50">
            <FaShieldAlt className="text-4xl text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Defense in Depth</h3>
            <p className="text-gray-300">
              Two-layer security: encrypted data hidden in images. Attackers won't even know it exists.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Encode Mode (Optional Encryption)</h4>
                <p className="text-gray-300">
                  Message → AES-256 Encrypt (optional) → Binary Conversion → LSB Embedding → Stego Image
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Decode Mode</h4>
                <p className="text-gray-300">
                  Stego Image → LSB Extraction → Binary to Text → AES-256 Decrypt (if encrypted) → Original Message
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center space-x-6">
          <Link
            to="/encode"
            className="group flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50"
          >
            <span>Start Encoding</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/decode"
            className="flex items-center space-x-2 bg-transparent border-2 border-purple-500 hover:bg-purple-500/20 text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            <span>Decode Message</span>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>⚠️ For educational and ethical use only. Always respect privacy and data protection laws.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
