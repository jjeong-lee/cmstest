import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SessionUser } from "../../modules/store/cms.types";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SessionUser | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: SessionUser }>();
    return request.user;
  },
);
