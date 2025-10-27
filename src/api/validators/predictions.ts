
import { z } from 'zod';

export const getPredictionsSchema = z.object({
  body: z.object({
    tradingCode: z.string().max(50),
    nhead: z.union([z.literal(1), z.literal(3), z.literal(7)]),
  }),
});
