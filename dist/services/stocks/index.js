import pool from '../../db/index.js';
export const getStocks = async () => {
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
export const getStockHistoryByID = async (tradingCode, start, end) => {
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
export const getStockByID = async (tradingCode) => {
    const query = `
        SELECT id, date, trading_code, ltp, high, low, openp, closep, ycp, trade, value, volume
        FROM stock_history
        WHERE trading_code = $1 AND date = (SELECT MAX(date) FROM stock_history WHERE trading_code = $1)
        `;
    const { rows } = await pool.query(query, [tradingCode]);
    if (rows.length === 0) {
        throw new Error(`Stock with trading code ${tradingCode} not found`);
    }
    return {
        ...rows[0],
        tradingCode: rows[0].trading_code,
    };
};
export const getFavoriteStocks = async (userID) => {
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
export const createFavoriteStock = async (tradingCode, userID) => {
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
export const removeFavoriteStock = async (tradingCode, userID) => {
    const query = `
    DELETE FROM favorite_stocks WHERE user_id = $1 AND trading_code = $2
  `;
    await pool.query(query, [userID, tradingCode]);
};
