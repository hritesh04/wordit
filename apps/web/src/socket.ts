import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? process.env.BACKEND_URL : "http://localhost:3000/";
export const socket = io(URL!);