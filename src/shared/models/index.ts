import type { Request } from 'express';

import type { User } from '../../users';

export interface AppRequest extends Request {
  user?: User
}
