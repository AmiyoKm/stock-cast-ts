
import { z } from 'zod';

export const getStockByIDSchema = z.object({
  params: z.object({
    tradingCodeID: z.string(),
  }),
  query: z.object({
    start: z.string().datetime().optional(),
    end: z.string().datetime().optional(),
  }),
});

export const createFavoriteStockSchema = z.object({
  body: z.object({
    tradingCode: z.string(),
  }),
});

export const removeFavoriteStockSchema = z.object({
  body: z.object({
    tradingCode: z.string(),
  }),
});
