import axios from 'axios';

// Use environment variable or default to localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/';

const api = axios.create({
    baseURL : baseURL
})

export default api;