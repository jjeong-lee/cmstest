import { BadRequestException, Injectable, Inject } from "@nestjs/common";
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
    const identifier = input.id?.trim() || input.email?.trim();
    const password = input.password?.trim();

    if (!identifier || !password) {
      throw new BadRequestException("Login requires an id or email plus password");
    }

    const session = this.store.authenticateUser(identifier, password);
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
