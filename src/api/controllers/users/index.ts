
import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { Password, type User } from '../../../models/users/index.ts';
import { MailerService } from '../../../services/mailer/index.ts';
import { TokenScope, TokenService } from '../../../services/tokens/index.ts';
import { UserService } from '../../../services/users/index.ts';
import { cleanUser } from '../../../lib/utils/users.ts';

export class UserController {
    private userService: UserService;
    private mailerService: MailerService;
    private tokenService: TokenService;

    constructor() {
        this.userService = new UserService();
        this.mailerService = new MailerService();
        this.tokenService = new TokenService();
    }

    async register(req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;

        try {
            const pass = await Password.new(password);
            const user = await this.userService.create({ name, email, password: pass, activated: false });

            const token = await this.tokenService.new(user.id, 3 * 24 * 60 * 60 * 1000, TokenScope.Activation);

            await this.mailerService.send(user as User, 'user_welcome.tmpl', {
                activationToken: token.plaintext,
                userID: user.id,
                frontendURL: process.env.FRONTEND_PROD_URL
            });

            res.status(202).json({ user: cleanUser(user) });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;

        try {
            const user = await this.userService.getByEmail(email);
            const match = await user.password.matches(password);

            if (!match) {
                res.status(401).json({ error: 'invalid credentials' });
                return;
            }

            const token = this.generateToken(user);
            res.status(200).json({ authentication_token: token });
        } catch (err: any) {
            res.status(401).json({ error: err.message });
        }
    }

    async activate(req: Request, res: Response): Promise<void> {
        const { token } = req.body;

        try {
            const user = await this.userService.getForToken(TokenScope.Activation, token);
            user.activated = true;
            const updatedUser = await this.userService.update(user);
            await this.tokenService.deleteAllForUser(TokenScope.Activation, user.id);
            res.status(200).json({ user: cleanUser(updatedUser) });
        } catch (err: any) {
            res.status(400).json({ error: err?.message });
        }
    }

    async sendActivationEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        try {
            const user = await this.userService.getByEmail(email);
            if (user.activated) {
                res.status(400).json({ error: 'user already activated' });
                return;
            }

            const token = await this.tokenService.new(user.id, 3 * 24 * 60 * 60 * 1000, TokenScope.Activation);

            await this.mailerService.send(user, 'user_welcome.tmpl', {
                activationToken: token.plaintext,
                userID: user.id,
                frontendURL: process.env.FRONTEND_PROD_URL
            });

            res.status(202).json({ message: 'email sent', token });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async createPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        try {
            const user = await this.userService.getByEmail(email);
            if (!user.activated) {
                res.status(400).json({ error: 'user not activated' });
                return;
            }

            const token = await this.tokenService.new(user.id, 1 * 60 * 60 * 1000, TokenScope.PasswordReset);

            await this.mailerService.send(user, 'token_password_reset.tmpl', {
                passwordResetToken: token.plaintext
            });

            res.status(202).json({ message: 'an email will be sent to you containing password reset instruction', token });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async updatePassword(req: Request, res: Response): Promise<void> {
        const { password, token } = req.body;

        try {
            const user = await this.userService.getForToken(TokenScope.PasswordReset, token);
            const newPassword = await Password.new(password);
            user.password = newPassword;

            const updatedUser = await this.userService.update(user);
            await this.tokenService.deleteAllForUser(TokenScope.PasswordReset, user.id);

            res.status(200).json({ message: 'your password was successfully reset' });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async getMe(req: Request, res: Response): Promise<void> {
        const user = req.user;
        res.status(200).json({ user: cleanUser(user) });
    }

    private generateToken(user: User): string {
        const claims = {
            sub: user.id,
            exp: Math.floor(Date.now() / 1000) + (3 * 24 * 60 * 60),
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            iss: process.env.JWT_ISSUER,
            aud: process.env.JWT_ISSUER,
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }

        return jwt.sign(claims, secret);
    }
}
