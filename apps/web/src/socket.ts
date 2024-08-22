import { io } from 'socket.io-client';

const URL = import.meta.env.MODE === 'production' ? import.meta.env.BACKEND_URL : "http://localhost:3000/";
console.log(import.meta.env)
export const socket = io(URL!);