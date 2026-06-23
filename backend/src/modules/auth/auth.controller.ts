import { Body, Controller, HttpCode, Post, Inject } from "@nestjs/common";
import { AuthService } from "./auth.service";

type LoginBody = {
  id?: string;
  password?: string;
  email?: string;
};

type SignupBody = {
  id: string;
  password: string;
  passwordConfirm: string;
  email: string;
};

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  login(@Body() body: LoginBody) {
    return this.authService.login(body);
  }

  @Post("signup")
  signup(@Body() body: SignupBody) {
    return this.authService.signup(body);
  }
}
