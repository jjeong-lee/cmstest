import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest<{ url: string }>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorType =
        status === HttpStatus.BAD_REQUEST
          ? "VALIDATION"
          : status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN
            ? "AUTHORIZATION"
            : status === HttpStatus.NOT_FOUND
              ? "NOT_FOUND"
              : status === HttpStatus.CONFLICT
                ? "CONFLICT"
                : "SYSTEM";
      response.status(exception.getStatus()).json({
        success: false,
        message: exception.message,
        data: null,
        error: {
          code: `HTTP_${status}`,
          type: errorType,
          details: [{ reason: request.url }],
        },
      });
      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      data: null,
      error: {
        code: "HTTP_500",
        type: "SYSTEM",
        details: [{ reason: request.url }],
      },
    });
  }
}
