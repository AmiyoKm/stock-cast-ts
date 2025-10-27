
import { Router } from 'express';
import userRoutes from './users/index.ts';
import stockRoutes from './stocks/index.ts';
import predictionRoutes from './predictions/index.ts';

const router = Router();

router.use('/users', userRoutes);
router.use('/stocks', stockRoutes);
router.use('/predict', predictionRoutes);

export default router;
