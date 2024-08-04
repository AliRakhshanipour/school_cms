import cors from 'cors';
import e from 'express';
import morgan from 'morgan';
import path from 'path';

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If you need to send cookies or authorization headers
};

export const middlewares = [
  e.static(path.join(process.cwd(), 'public')),
  e.json(),
  e.urlencoded({ extended: true }),
  morgan('dev'),
  cors(corsOptions),
];
