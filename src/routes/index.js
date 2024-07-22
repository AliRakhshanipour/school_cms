import { Router } from 'express';
import userRoutes from "./user.routes.js"

const router = Router();

// Combine routes from different files
const mainRoutes = [
    { path: '/users', router: userRoutes },
];

mainRoutes.forEach(route => {
    router.use(route.path, route.router);
});

export default router;
