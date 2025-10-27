
import { type NextFunction, type Request, type Response } from 'express';
import * as stockService from '../../../services/stocks/index.js';

export const getStocks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stocks = await stockService.getStocks();
        res.json(stocks);
    } catch (error) {
        next(error);
    }
};

export const getStockHistoryByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tradingCodeID } = req.params;
        let { start, end } = req.query;

        let startDate: Date;
        let endDate: Date;

        if (typeof start === 'string') {
            startDate = new Date(start);
        } else {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 60);
        }

        if (typeof end === 'string') {
            endDate = new Date(end);
        } else {
            endDate = new Date();
        }

        const stocks = await stockService.getStockHistoryByID(tradingCodeID, startDate, endDate);
        res.json({ stocks: stocks });
    } catch (error) {
        next(error);
    }
};

export const getStockByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tradingCodeID } = req.params;

        const stock = await stockService.getStockByID(tradingCodeID);
        res.json({ stock: stock });
    } catch (error) {
        next(error);
    }
};

export const getFavoriteStocks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;

        const stocks = await stockService.getFavoriteStocks(id);
        res.json({ stocks });
    } catch (error) {
        next(error);
    }
};

export const createFavoriteStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;
        const { trading_code } = req.body;
        await stockService.createFavoriteStock(trading_code, id);
        res.status(201).send();
    } catch (error) {
        next(error);
    }
};

export const removeFavoriteStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;
        const { trading_code } = req.body;
        await stockService.removeFavoriteStock(trading_code, id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
