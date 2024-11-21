import axios from 'axios';


const API = axios.create({baseURL: 'https://empire-app.onrender.com'})
export const userChats = (id) => API.get(`/chat/${id}`)