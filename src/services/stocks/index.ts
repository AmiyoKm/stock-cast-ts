
import pool from '../../db/index.js';
import { type Stock } from '../../models/stocks/index.js';

export const getStocks = async (): Promise<Stock[]> => {
  const query = `SELECT id, date, trading_code, ltp, high, low, openp, closep, ycp, trade, value, volume
              FROM stock_history
              WHERE date = (SELECT MAX(date) FROM stock_history);
  `;
  const { rows } = await pool.query(query);
  return rows.map(row => ({
    ...row,
    tradingCode: row.trading_code,
  }));
};

export const getStockByID = async (tradingCode: string, start: Date, end: Date): Promise<Stock[]> => {
  const query = `SELECT id, date, trading_code, ltp, high, low, openp, closep, ycp, trade, value, volume
              FROM stock_history
              WHERE trading_code = $1 AND date >= $2 AND date <= $3
              ORDER BY date ASC`;
  const { rows } = await pool.query(query, [tradingCode, start, end]);
  return rows.map(row => ({
    ...row,
    tradingCode: row.trading_code,
  }));
};

export const getFavoriteStocks = async (userID: number): Promise<Stock[]> => {
  const query = `
    SELECT DISTINCT ON (s.trading_code)
      s.id, s.date, s.trading_code, s.ltp, s.high, s.low, s.openp, s.closep, s.ycp, s.trade, s.value, s.volume
    FROM stock_history s
    JOIN favorite_stocks f ON s.trading_code = f.trading_code
    WHERE f.user_id = $1
    ORDER BY s.trading_code, s.date DESC;
  `;
  const { rows } = await pool.query(query, [userID]);
  return rows.map(row => ({
    ...row,
    tradingCode: row.trading_code,
  }));
};

export const createFavoriteStock = async (tradingCode: string, userID: number): Promise<void> => {
  const query = `
    INSERT INTO favorite_stocks(
    user_id,
    trading_code
  ) VALUES(
    $1,
    $2
  );
  `;
  await pool.query(query, [userID, tradingCode]);
};

export const removeFavoriteStock = async (tradingCode: string, userID: number): Promise<void> => {
  const query = `
    DELETE FROM favorite_stocks WHERE user_id = $1 AND trading_code = $2
  `;
  await pool.query(query, [userID, tradingCode]);
};
