import axios from 'axios';

const baseURL = 'http://localhost:5000/';
// const baseURL = 'https://eko-mart.onrender.com/'; // Use this for production

const api = axios.create({
    baseURL : baseURL
})

export default api;