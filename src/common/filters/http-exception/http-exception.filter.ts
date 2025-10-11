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

    console.log('Error Response:', errorResponse);

    // Try to render error template, fall back to JSON if template fails
    try {
      response.status(status).render('error', { error: errorResponse });
    } catch (renderError) {
      console.log(
        'Error rendering template, falling back to JSON:',
        renderError,
      );
      response.status(status).json(errorResponse);
    }
  }
}
