import crypto from 'crypto';
import pool from '../../db/index.js';
import { Password } from '../../models/users/index.js';
const PQ_DUPLICATE_EMAIL = '23505';
export class UserService {
    async create(user) {
        if (!user.password || !user.password.plaintext) {
            throw new Error('missing password');
        }
        const password = await Password.new(user.password.plaintext);
        const query = `
            INSERT INTO users (name, email, password_hash, activated)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at, version, updated_at
        `;
        const args = [user.name, user.email, password.hash, user.activated];
        try {
            const result = await pool.query(query, args);
            const newUser = result.rows[0];
            return {
                ...user,
                id: newUser.id,
                password,
                created_at: newUser.created_at,
                version: newUser.version,
                updated_at: newUser.updated_at,
            };
        }
        catch (err) {
            if (err?.code === PQ_DUPLICATE_EMAIL) {
                throw new Error('duplicate email');
            }
            throw err;
        }
    }
    async get(id) {
        const query = `
            SELECT id, created_at, name, email, password_hash, activated, version, updated_at
            FROM users WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('not found');
        }
        const userData = result.rows[0];
        return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: new Password(null, userData.password_hash),
            activated: userData.activated,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            version: userData.version,
        };
    }
    async getByEmail(email) {
        const query = `
            SELECT id, created_at, name, email, password_hash, activated, version, updated_at
            FROM users WHERE email = $1
        `;
        const result = await pool.query(query, [email]);
        if (result.rows.length === 0) {
            throw new Error('not found');
        }
        const userData = result.rows[0];
        return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: new Password(null, userData.password_hash),
            activated: userData.activated,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            version: userData.version,
        };
    }
    async update(user) {
        const query = `
            UPDATE users SET name = $1, email = $2, password_hash = $3, activated = $4, version = version + 1, updated_at = now()
            WHERE id = $5 AND version = $6
            RETURNING version, updated_at
        `;
        const args = [user.name, user.email, user.password.hash, user.activated, user.id, user.version];
        try {
            const result = await pool.query(query, args);
            if (result.rows.length === 0) {
                throw new Error('edit conflict');
            }
            const updatedUser = result.rows[0];
            return {
                ...user,
                version: updatedUser.version,
                updated_at: updatedUser.updated_at,
            };
        }
        catch (err) {
            if (err?.code === PQ_DUPLICATE_EMAIL) {
                throw new Error('duplicate email');
            }
            throw err;
        }
    }
    async getForToken(tokenScope, tokenPlaintext) {
        const tokenHash = crypto.createHash('sha256').update(tokenPlaintext).digest('hex');
        const query = `
            SELECT users.id, users.created_at, users.name, users.email, users.password_hash, users.activated, users.version, updated_at FROM users
            INNER JOIN tokens
            ON users.id = tokens.user_id
            WHERE tokens.hash = $1
            AND tokens.scope = $2
            AND tokens.expiry > $3
        `;
        const args = [tokenHash, tokenScope, new Date()];
        const result = await pool.query(query, args);
        if (result.rows.length === 0) {
            throw new Error('not found');
        }
        const userData = result.rows[0];
        return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: new Password(null, userData.password_hash),
            activated: userData.activated,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
            version: userData.version,
        };
    }
}
