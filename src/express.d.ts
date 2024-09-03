// src/express.d.ts

import { profileRoles } from './shared/utils/constants';

declare global {
  namespace Express {
    interface Request {
      profile?: {
        id: number;
        role: keyof typeof profileRoles; // or the actual role type if you have it defined
        // Add other profile properties here as needed
      };
    }
  }
}
