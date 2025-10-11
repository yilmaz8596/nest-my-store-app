import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    console.log('❌ Error caught by filter:', errorResponse);
    console.log('❌ Exception details:', exception);
    if (exception instanceof Error) {
      console.log('❌ Error stack:', exception.stack);
    }

    // Temporarily disable template rendering and use JSON for all errors
    // TODO: Re-enable template rendering once views directory issue is resolved
    response.status(status).json(errorResponse);
  }
}
