import pool from '../../db/index.js';
export const getHistory = async (tradingCode, start, end) => {
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
