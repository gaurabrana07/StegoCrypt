import { useState } from 'react';
import { FaUpload, FaLock, FaEye, FaExclamationTriangle, FaCopy } from 'react-icons/fa';
import { decodeMessage } from '../api';

const Decode = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [decodedMessage, setDecodedMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleImageSelect = (e) => {
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
    setDecodedMessage('');
    setResult(null);
  };

  const handleDecode = async () => {
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    if (usePassword && !password.trim()) {
      setError('Please enter the decryption password');
      return;
    }

    setLoading(true);
    setError('');
    setDecodedMessage('');
    setResult(null);

    try {
      const response = await decodeMessage(
        selectedImage,
        usePassword ? password : ''
      );

      setDecodedMessage(response.message);
      setResult({
        decryptionUsed: response.decryption_used,
        messageLength: response.message_length,
      });
    } catch (err) {
      const errorDetail = err.response?.data?.detail || 'Failed to decode message';
      
      if (errorDetail.includes('Invalid password')) {
        setError('❌ Invalid password or message was not encrypted');
      } else if (errorDetail.includes('No hidden message')) {
        setError('❌ No hidden message found in this image');
      } else {
        setError(`❌ ${errorDetail}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(decodedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Decode Message
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaUpload className="mr-2" />
                Upload Stego Image
              </h3>

              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-500 border-dashed rounded-lg cursor-pointer hover:bg-blue-500/10 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 rounded-lg"
                    />
                  ) : (
                    <>
                      <FaUpload className="text-4xl text-blue-500 mb-2" />
                      <p className="text-sm text-gray-300">
                        Click to upload stego image
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

              <p className="text-xs text-gray-400 mt-3">
                Upload the image with hidden message to extract it
              </p>
            </div>

            {/* Password Input */}
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <FaLock className="mr-2" />
                  Decryption Password
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={usePassword}
                    onChange={(e) => setUsePassword(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              {usePassword && (
                <input
                  type="password"
                  className="w-full bg-cyber-dark border border-blue-500/30 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter decryption password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}

              <p className="text-xs text-gray-400 mt-2">
                {usePassword
                  ? 'Enter the password used during encryption'
                  : 'Enable if the message was encrypted'}
              </p>
            </div>

            {/* Decode Button */}
            <button
              onClick={handleDecode}
              disabled={loading || !selectedImage}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50 flex items-center justify-center space-x-2"
            >
              <FaEye />
              <span>{loading ? 'Decoding...' : 'Decode Message'}</span>
            </button>

            {/* Info Card */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3">💡 How to Use</h3>
              <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                <li>Upload the stego image</li>
                <li>If the message was encrypted, enable password and enter it</li>
                <li>Click "Decode Message"</li>
                <li>View the extracted message</li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-xs text-yellow-200">
                  <strong>⚠️ Important:</strong> If you encrypted the message during encoding, you MUST enable the password toggle and enter the correct password. Without it, you'll see encrypted (garbled) text instead of the original message.
                </p>
              </div>
            </div>
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
            {decodedMessage && (
              <>
                <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-xl p-6 fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      Hidden Message
                    </h3>
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      <FaCopy />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="bg-cyber-dark border border-green-500/30 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                    <pre className="text-white whitespace-pre-wrap break-words font-mono text-sm">
                      {decodedMessage}
                    </pre>
                  </div>
                </div>

                <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 fade-in">
                  <h3 className="text-lg font-bold text-white mb-3">
                    ✅ Decoding Successful
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <span className="text-white font-bold">Message Length:</span>{' '}
                      {result?.messageLength} characters
                    </p>
                    <p className="text-gray-300">
                      <span className="text-white font-bold">Decryption:</span>{' '}
                      {result?.decryptionUsed ? (
                        <span className="text-green-400">
                          ✓ Used (AES-256)
                        </span>
                      ) : (
                        <span className="text-gray-400">✗ Not required</span>
                      )}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-white font-bold">
                        Data Extracted From:
                      </span>{' '}
                      {selectedImage?.name}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Placeholder when no result */}
            {!decodedMessage && !error && (
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 border border-gray-500/30 rounded-xl p-8 h-96 flex flex-col items-center justify-center text-center">
                <FaEye className="text-6xl text-gray-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">
                  No Message Yet
                </h3>
                <p className="text-gray-500 text-sm">
                  Upload a stego image and click decode to extract the hidden
                  message
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decode;
