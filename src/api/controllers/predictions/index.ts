
import { type Request, type Response, type NextFunction } from 'express';
import * as predictionService from '../../../services/predictions/index.js';

export const getPredictions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tradingCode, nhead } = req.body;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 4);

    const stockHistory = await predictionService.getHistory(tradingCode, startDate, endDate);

    if (stockHistory.length < 60) {
      return res.status(404).json({ message: 'Not enough historical data to make a prediction.' });
    }

    const predictorURL = process.env.PREDICTOR_URL || 'http://predictor:8000';

    const response = await fetch(`${predictorURL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tradingCode,
        nhead: parseInt(nhead, 10),
        history: stockHistory,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
};
