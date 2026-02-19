import { useState } from 'react';
import { FaUpload, FaLock, FaCheck, FaExclamationTriangle, FaDownload } from 'react-icons/fa';
import { encodeMessage, checkCapacity } from '../api';

const Encode = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [useEncryption, setUseEncryption] = useState(false);
  const [capacity, setCapacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stegoImage, setStegoImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image (PNG, JPEG, or BMP)');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
    setStegoImage(null);
    setResult(null);

    // Check capacity
    try {
      const capacityData = await checkCapacity(file);
      setCapacity(capacityData.capacity);
    } catch (err) {
      setError('Failed to analyze image capacity');
    }
  };

  const handleEncode = async () => {
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message to hide');
      return;
    }

    if (useEncryption && !password.trim()) {
      setError('Please enter a password for encryption');
      return;
    }

    setLoading(true);
    setError('');
    setStegoImage(null);
    setResult(null);

    try {
      const response = await encodeMessage(
        selectedImage,
        message,
        useEncryption ? password : ''
      );

      // Create download URL
      const url = URL.createObjectURL(response.blob);
      setStegoImage(url);
      setResult({
        capacityUsed: response.capacityUsed,
        encryptionUsed: response.encryptionUsed,
        messageSize: response.messageSize,
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to encode message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!stegoImage) return;

    const link = document.createElement('a');
    link.href = stegoImage;
    link.download = 'stego_image.png';
    link.click();
  };

  const messageLength = new Blob([message]).size;
  const capacityPercent = capacity ? (messageLength / capacity.max_bytes) * 100 : 0;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Encode Message
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaUpload className="mr-2" />
                Upload Cover Image
              </h3>

              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-purple-500 border-dashed rounded-lg cursor-pointer hover:bg-purple-500/10 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 rounded-lg"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-4xl text-purple-500 mb-2" />
                      <p className="text-sm text-gray-300">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPEG, or BMP</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/bmp"
                  onChange={handleImageSelect}
                />
              </label>

              {capacity && (
                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <span className="font-bold text-white">Max Capacity:</span>{' '}
                    {capacity.max_kb} KB ({capacity.max_bytes.toLocaleString()}{' '}
                    bytes)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Image: {capacity.width} × {capacity.height} pixels
                  </p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Secret Message</h3>

              <textarea
                className="w-full h-32 bg-cyber-dark border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Enter your secret message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-400">
                  {messageLength} bytes{' '}
                  {capacity && `/ ${capacity.max_bytes.toLocaleString()}`}
                </span>
                {capacity && (
                  <span
                    className={
                      capacityPercent > 90
                        ? 'text-red-400'
                        : capacityPercent > 70
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }
                  >
                    {capacityPercent.toFixed(1)}% used
                  </span>
                )}
              </div>

              {capacity && capacityPercent > 0 && (
                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      capacityPercent > 90
                        ? 'bg-red-500'
                        : capacityPercent > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Encryption Options */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <FaLock className="mr-2" />
                  Encryption (Optional)
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={useEncryption}
                    onChange={(e) => setUseEncryption(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>

              {useEncryption && (
                <input
                  type="password"
                  className="w-full bg-cyber-dark border border-purple-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter encryption password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}

              <p className="text-xs text-gray-400 mt-2">
                Enable AES-256 encryption for maximum security
              </p>
            </div>

            {/* Encode Button */}
            <button
              onClick={handleEncode}
              disabled={loading || !selectedImage || !message.trim()}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50"
            >
              {loading ? 'Encoding...' : 'Encode Message'}
            </button>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 flex items-start fade-in">
                <FaExclamationTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Success Result */}
            {result && (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 fade-in">
                <div className="flex items-center mb-3">
                  <FaCheck className="text-green-500 mr-2" />
                  <h3 className="text-lg font-bold text-white">
                    Message Encoded Successfully!
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    <span className="text-white font-bold">Capacity Used:</span>{' '}
                    {result.capacityUsed}%
                  </p>
                  <p className="text-gray-300">
                    <span className="text-white font-bold">Encryption:</span>{' '}
                    {result.encryptionUsed === true ? (
                      <span className="text-green-400">✓ Enabled (AES-256)</span>
                    ) : (
                      <span className="text-yellow-400">✗ Not Used</span>
                    )}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-white font-bold">Message Size:</span>{' '}
                    {result.messageSize} bytes
                  </p>
                </div>
              </div>
            )}

            {/* Stego Image Preview */}
            {stegoImage && (
              <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-xl p-6 fade-in">
                <h3 className="text-xl font-bold text-white mb-4">
                  Stego Image
                </h3>

                <img
                  src={stegoImage}
                  alt="Stego"
                  className="w-full rounded-lg border border-green-500/30 mb-4"
                />

                <button
                  onClick={handleDownload}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-green-500/50"
                >
                  <FaDownload />
                  <span>Download Stego Image</span>
                </button>

                <p className="text-xs text-gray-400 mt-3 text-center">
                  Image saved as PNG with hidden message embedded
                </p>
              </div>
            )}

            {/* Info Card */}
            {!result && !error && (
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">💡 How to Use</h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Upload an image (PNG, JPEG, or BMP)</li>
                  <li>Enter your secret message</li>
                  <li>Optionally enable encryption with a password</li>
                  <li>Click "Encode Message"</li>
                  <li>Download the stego image</li>
                </ol>
                <p className="text-xs text-gray-400 mt-4">
                  ⚠️ The stego image looks identical to the original but contains
                  your hidden message.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encode;
