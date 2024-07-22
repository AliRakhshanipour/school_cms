import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { UserController } from '../controllers/user/user.controller.js';


const router = Router();

const userRoutes = [
    { method: 'post', path: '/create', handler: [UserController.create] },
    { method: 'get', path: '/list', handler: [UserController.getUsers] },
    { method: 'patch', path: '/:id/update', handler: [UserController.update] },
    { method: 'delete', path: '/:id/delete', handler: [UserController.delete] },
    { method: 'get', path: '/:id', handler: [UserController.get] },
];

registerRoutes(router, userRoutes);

export default router;
