import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { environment } from '@pokemon/shared/util-env';
import { randomBytes } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { TokenBlacklistService } from '../user/blacklist.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException('No authorization header found', HttpStatus.UNAUTHORIZED);
    }

    const token = authorizationHeader.replace('Bearer ', '');

    if (this.tokenBlacklistService.has(token)) {
      throw new HttpException('Token is invalidated', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = verify(token, environment.JWT_SECRET_KEY) as { userId: string };
      request['userId'] = payload.userId;
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}