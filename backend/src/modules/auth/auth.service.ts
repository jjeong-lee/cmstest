import { Injectable, UnauthorizedException } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class AuthService {
  constructor(private readonly store: MockCmsStoreService) {}

  login(email: string) {
    const user = this.store.findUserByEmail(email);
    if (!user || user.status !== "active") {
      throw new UnauthorizedException("Invalid credentials");
    }

    const session = this.store.createSession(email);
    return {
      token: session.token,
      user: session,
      workspace: this.store.getWorkspace(),
    };
  }
}
