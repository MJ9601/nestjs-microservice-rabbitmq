import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken() ||
        ExtractJwt.fromExtractors([JwtStrategy.extractJwtFromCookie]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  private static extractJwtFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }
  }

  async validate(payload) {
    return payload;
  }
}
