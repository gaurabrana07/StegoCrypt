import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const encodeMessage = async (image, message, password = '') => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('message', message);
  if (password && password.trim()) {
    formData.append('password', password);
  }

  const response = await api.post('/encode', formData, {
    responseType: 'blob',
  });

  console.log('All headers:', response.headers);
  console.log('Capacity header:', response.headers['x-capacity-used']);
  console.log('Encryption header:', response.headers['x-encryption-used']);
  console.log('Message size header:', response.headers['x-message-size']);

  const encryptionHeader = response.headers['x-encryption-used'];

  return {
    blob: response.data,
    capacityUsed: response.headers['x-capacity-used'],
    encryptionUsed: encryptionHeader === 'True',
    messageSize: response.headers['x-message-size'],
  };
};

export const decodeMessage = async (image, password = '') => {
  const formData = new FormData();
  formData.append('image', image);
  if (password) {
    formData.append('password', password);
  }

  const response = await api.post('/decode', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const checkCapacity = async (image) => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await api.post('/capacity', formData);
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
