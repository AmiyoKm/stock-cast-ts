
import bcrypt from 'bcrypt';

export class Password {
    plaintext: string | null;
    hash: string | null;

    constructor(plaintext: string | null, hash: string | null) {
        this.plaintext = plaintext;
        this.hash = hash;
    }

    static async new(plaintextPassword: string): Promise<Password> {
        const hash = await bcrypt.hash(plaintextPassword, 12);
        return new Password(plaintextPassword, hash);
    }

    async matches(plaintextPassword: string): Promise<boolean> {
        if (!this.hash) {
            throw new Error("password hash is null")
        }
        return await bcrypt.compare(plaintextPassword, this.hash);
    }
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: Password;
    activated: boolean;
    created_at: Date;
    updated_at: Date;
    version: number;
}
