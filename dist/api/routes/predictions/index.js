import { Router } from 'express';
import * as predictionController from '../../controllers/predictions/index.js';
import { validate } from '../../middlewares/validate.js';
import { getPredictionsSchema } from '../../validators/predictions.js';
const router = Router();
router.post('/', validate(getPredictionsSchema), predictionController.getPredictions);
export default router;
