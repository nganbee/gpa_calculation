import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/gpa',
});

export const calculateGPA = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/calculate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const predictGPA = async (predictData) => {
  const response = await api.post('/predict', predictData);
  return response.data;
};
