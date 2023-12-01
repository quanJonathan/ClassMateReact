import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    // if (!request.user?.isEmailConfirmed) {
    //   throw new UnauthorizedException('Confirm your email first');
    // }

    return true;
  }
}
