
import { Router } from 'express';
import { UserController } from '../../controllers/users/index.ts';
import { requireAuth } from '../../middlewares/auth.ts';
import { validate } from '../../middlewares/validate.ts';
import {
  activateUserSchema,
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resendActivationSchema,
  resetPasswordSchema,
} from '../../validators/users.ts';

const router = Router();
const userController = new UserController();

router.post('/register', validate(registerUserSchema), (req, res) =>
  userController.register(req, res)
);
router.post('/login', validate(loginUserSchema), (req, res) =>
  userController.login(req, res)
);
router.post('/activate', validate(activateUserSchema), (req, res) =>
  userController.activate(req, res)
);
router.post(
  '/resend-activation',
  validate(resendActivationSchema),
  (req, res) => userController.sendActivationEmail(req, res)
);
router.post('/forgot-password', validate(forgotPasswordSchema), (req, res) =>
  userController.createPassword(req, res)
);
router.post('/reset-password', validate(resetPasswordSchema), (req, res) =>
  userController.updatePassword(req, res)
);

router.get('/me', requireAuth, (req, res) => userController.getMe(req, res));

export default router;

