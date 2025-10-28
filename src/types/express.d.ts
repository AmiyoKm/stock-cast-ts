import { User } from '../../models/users';

declare global {
  namespace Express {
    export interface Request {
      user?: User | null;
    }
  }
}