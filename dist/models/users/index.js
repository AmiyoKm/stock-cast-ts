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
