import { BadRequestException, Injectable, UnauthorizedException, Inject } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

type LoginInput = {
  id?: string;
  password?: string;
  email?: string;
};

type SignupInput = {
  id: string;
  password: string;
  passwordConfirm: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(@Inject(MockCmsStoreService) private readonly store: MockCmsStoreService) {}

  login(input: LoginInput) {
    if (input.id && input.password) {
      const session = this.store.authenticateUser(input.id, input.password);
      return {
        token: session.token,
        user: session,
        workspace: this.store.getWorkspace(),
      };
    }

    const email = input.email?.trim();
    if (!email) {
      throw new BadRequestException("Login requires either id/password or email");
    }

    const user = this.store.findUserByEmail(email);
    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException("Invalid credentials");
    }

    const session = this.store.createSession(email);
    return {
      token: session.token,
      user: session,
      workspace: this.store.getWorkspace(),
    };
  }

  signup(input: SignupInput) {
    if (input.password !== input.passwordConfirm) {
      throw new BadRequestException("Password confirmation does not match");
    }

    const session = this.store.registerUser({
      id: input.id,
      password: input.password,
      email: input.email,
    });

    return {
      token: session.token,
      user: session,
      workspace: this.store.getWorkspace(),
    };
  }
}
