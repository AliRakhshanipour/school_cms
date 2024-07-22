import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';


const router = Router();

const userRoutes = [
    // { method: 'get', path: '/:id', handler: [authenticate, getUser] },
];

registerRoutes(router, userRoutes);

export default router;
