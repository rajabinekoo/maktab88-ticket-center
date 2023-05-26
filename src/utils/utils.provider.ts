import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UtilsProvider {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async errorLogger(error, funcName: string, serviceName: string) {
    this.logger.error({
      error: error?.message || 'unknown',
      createdAt: new Date().toISOString(),
      stack: `Something went wrong in ${funcName} function at the ${serviceName}`,
    });
  }
}
