import * as stockService from '../../../services/stocks/index.js';
export const getStocks = async (req, res, next) => {
    try {
        const stocks = await stockService.getStocks();
        res.json(stocks);
    }
    catch (error) {
        next(error);
    }
};
export const getStockByID = async (req, res, next) => {
    try {
        const { tradingCodeID } = req.params;
        let { start, end } = req.query;
        let startDate;
        let endDate;
        if (typeof start === 'string') {
            startDate = new Date(start);
        }
        else {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 60);
        }
        if (typeof end === 'string') {
            endDate = new Date(end);
        }
        else {
            endDate = new Date();
        }
        const stock = await stockService.getStockByID(tradingCodeID, startDate, endDate);
        res.json(stock);
    }
    catch (error) {
        next(error);
    }
};
export const getFavoriteStocks = async (req, res, next) => {
    try {
        const { id } = req.user;
        const stocks = await stockService.getFavoriteStocks(id);
        res.json(stocks);
    }
    catch (error) {
        next(error);
    }
};
export const createFavoriteStock = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { tradingCode } = req.body;
        await stockService.createFavoriteStock(tradingCode, id);
        res.status(201).send();
    }
    catch (error) {
        next(error);
    }
};
export const removeFavoriteStock = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { tradingCode } = req.body;
        await stockService.removeFavoriteStock(tradingCode, id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
