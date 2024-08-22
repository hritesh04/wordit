import { io } from 'socket.io-client';

const URL = import.meta.env.NODE_ENV === 'production' ? import.meta.env.BACKEND_URL : "http://localhost:3000/";
console.log(URL)
export const socket = io(URL!);