import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const { statusCode } = res;
    const contentLength = res.get('content-length');
    const logMessage = `METHOD: ${method}, API: ${originalUrl}, Request IP: ${ip}, Agent: ${userAgent}, Status: ${statusCode}, Content-Length: ${contentLength}`;
    this.logger.debug(logMessage);

    next();
  }
}
