import { z } from 'zod';
export const getStockHistoryByIDSchema = z.object({
    params: z.object({
        tradingCodeID: z.string(),
    }),
    query: z.object({
        start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    }),
});
export const getStockByIDSchema = z.object({
    params: z.object({
        tradingCodeID: z.string(),
    }),
});
export const createFavoriteStockSchema = z.object({
    body: z.object({
        trading_code: z.string(),
    }),
});
export const removeFavoriteStockSchema = z.object({
    body: z.object({
        trading_code: z.string(),
    }),
});
