
import { Router } from 'express';
import userRoutes from './users/index.js';
import stockRoutes from './stocks/index.js';
import predictionRoutes from './predictions/index.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/stocks', stockRoutes);
router.use('/predict', predictionRoutes);

export default router;
