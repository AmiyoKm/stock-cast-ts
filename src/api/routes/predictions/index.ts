
import { Router } from 'express';
import * as predictionController from '../../controllers/predictions/index.ts';
import { validate } from '../../middlewares/validate.ts';
import { getPredictionsSchema } from '../../validators/predictions.ts';

const router = Router();

router.post('/', validate(getPredictionsSchema), predictionController.getPredictions);

export default router;
