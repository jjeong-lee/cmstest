import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { MockCmsStoreService } from "../../modules/store/mock-cms-store.service";

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly store: MockCmsStoreService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: unknown;
    }>();
    const authorization = request.headers.authorization;
    const token = authorization?.replace(/^Bearer\s+/i, "") ?? request.headers["x-demo-user"];

    if (!token) {
      throw new UnauthorizedException("Missing session token");
    }

    const user = this.store.getSessionFromToken(token);
    if (!user) {
      throw new UnauthorizedException("Invalid session token");
    }

    request.user = user;
    return true;
  }
}
