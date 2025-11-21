import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly validToken = process.env.AUTHORIZATION_TOKEN || 'web-token';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Header de autorización requerido');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (token !== this.validToken) {
      throw new UnauthorizedException('Token de autorización inválido');
    }

    return true;
  }
}
