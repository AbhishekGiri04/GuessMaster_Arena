import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const instance = axios.create({ baseURL: API });

const getRooms = async (token) => {
  const res = await instance.get('/matchmaking/rooms', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

const createRoom = async (token, body) => {
  const res = await instance.post('/matchmaking/create', body, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

const joinRoom = async (token, roomId) => {
  const res = await instance.post(`/matchmaking/join/${roomId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export default { getRooms, createRoom, joinRoom };
