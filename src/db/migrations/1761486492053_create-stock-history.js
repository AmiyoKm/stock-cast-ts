/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS stock_history (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      trading_code VARCHAR(20) NOT NULL,
      ltp DOUBLE PRECISION NOT NULL,
      high DOUBLE PRECISION NOT NULL,
      low DOUBLE PRECISION NOT NULL,
      openp DOUBLE PRECISION NOT NULL,
      closep DOUBLE PRECISION NOT NULL,
      ycp DOUBLE PRECISION NOT NULL,
      trade INTEGER NOT NULL,
      value DOUBLE PRECISION NOT NULL,
      volume INTEGER NOT NULL
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS stock_history;
  `);
};
