import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CarrierGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

const validateRequest = (request) => {
  const loggedInUserRoles: [string] = request.query.loggedInUserRoles;
  if (!loggedInUserRoles?.includes('COURIER')) {
    throw new HttpException('Unauthorized', 401);
  }
  return true;
};

@Injectable()
export class TeamLead implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateTeamRequest(request);
  }
}
const validateTeamRequest = (request) => {
  const loggedInUserRoles: [string] = request.query.loggedInUserRoles;
  if (!loggedInUserRoles?.includes('TEAM_LEAD')) {
    throw new HttpException('Unauthorized', 401);
  }
  return true;
};

@Injectable()
export class SuperAdmin implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateSuperAdminRequest(request);
  }
}
const validateSuperAdminRequest = (request) => {
  const loggedInUserRoles: [string] = request.query.loggedInUserRoles;
  if (!loggedInUserRoles?.includes('SPOTPAY_SUPER_ADMIN')) {
    throw new HttpException('Unauthorized', 401);
  }
  return true;
};
