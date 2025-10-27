import bcrypt from 'bcrypt';
export class Password {
    constructor(plaintext, hash) {
        this.plaintext = plaintext;
        this.hash = hash;
    }
    static async new(plaintextPassword) {
        const hash = await bcrypt.hash(plaintextPassword, 12);
        return new Password(plaintextPassword, hash);
    }
    async matches(plaintextPassword) {
        if (!this.hash) {
            throw new Error("password hash is null");
        }
        return await bcrypt.compare(plaintextPassword, this.hash);
    }
}
export const AnonymousUser = {
    id: 0,
    name: '',
    email: '',
    password: new Password('', ''),
    activated: false,
    created_at: new Date(),
    updated_at: new Date(),
    version: 0,
};
