import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { handleErrorCatch } from '../shared/utils/helper';
import * as jwt from 'jsonwebtoken';

import { config } from '../shared/config';
import { profileRoles } from 'src/shared/utils/constants';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {
    console.log('AuthMiddleware is called');
  }
  use(req: Request | any, res: Response, next: NextFunction) {
    try {
      const token = req?.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new HttpException(`User not authorized`, HttpStatus.UNAUTHORIZED);
      }
      const user = jwt.verify(token, config.jwtSecret);
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        // if the error thrown is because the JWT is unauthorized,
        // return a 401 error
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: `Invalid or expired token`,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      handleErrorCatch(err);
    }
  }
}
