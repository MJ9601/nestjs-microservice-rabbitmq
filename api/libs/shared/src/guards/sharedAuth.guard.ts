import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ShardAuthGuard implements CanActivate {
  // role: number;

  constructor(

    @Inject("AUTH_SERVICE") private readonly authService:ClientProxy
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const req = context.switchToHttp().getRequest();

    // const user = req.user;

    // if (!user.role || this.role > user.role) return false;

    return true;
  }
}
