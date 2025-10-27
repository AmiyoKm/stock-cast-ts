
import pool from '../../db/index.js';
import crypto from 'crypto';

export enum TokenScope {
    Activation = 'activation',
    PasswordReset = 'password-reset',
}

export interface Token {
    plaintext: string;
    hash: string;
    userId: number;
    expiry: Date;
    scope: TokenScope;
}

function generateToken(userId: number, ttl: number, scope: TokenScope): Token {
    const token: Token = {
        plaintext: crypto.randomBytes(16).toString('hex'),
        hash: '',
        userId,
        expiry: new Date(Date.now() + ttl),
        scope,
    };

    const hash = crypto.createHash('sha256').update(token.plaintext).digest('hex');
    token.hash = hash;

    return token;
}

export class TokenService {
    async new(userId: number, ttl: number, scope: TokenScope): Promise<Token> {
        const token = generateToken(userId, ttl, scope);
        const query = `
            INSERT INTO tokens (hash, user_id, expiry, scope)
            VALUES ($1, $2, $3, $4)
        `;
        const args = [token.hash, token.userId, token.expiry, token.scope];
        await pool.query(query, args);
        return token;
    }

    async deleteAllForUser(scope: TokenScope, userId: number): Promise<void> {
        const query = `
            DELETE FROM tokens
            WHERE scope = $1 AND user_id = $2
        `;
        await pool.query(query, [scope, userId]);
    }
}
