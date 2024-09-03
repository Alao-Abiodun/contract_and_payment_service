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
      const profile = jwt.verify(token, config.jwtSecret);
      req.profile = profile;
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
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

@Injectable()
export class clientPermissionCheck implements NestMiddleware {
  constructor() {
    console.log('AuthMiddleware is called');
  }
  use(req: Request, res: Response, next: NextFunction) {
    if (req.profile.role !== profileRoles.CLIENT) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `You are not authorized to access this resource`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
