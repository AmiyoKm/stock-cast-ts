
import { Router } from 'express';
import * as stockController from '../../controllers/stocks/index.ts';
import { requireAuth } from '../../middlewares/auth.ts';
import { validate } from '../../middlewares/validate.ts';
import {
    createFavoriteStockSchema,
    getStockByIDSchema,
    removeFavoriteStockSchema,
} from '../../validators/stocks.ts';

const router = Router();

router.get('/', stockController.getStocks);

router.get('/favorite', requireAuth, stockController.getFavoriteStocks);
router.post('/favorite', requireAuth, validate(createFavoriteStockSchema), stockController.createFavoriteStock);
router.delete('/favorite', requireAuth, validate(removeFavoriteStockSchema), stockController.removeFavoriteStock);

router.get('/:tradingCodeID', validate(getStockByIDSchema), stockController.getStockByID);

export default router;
