import { Module } from '@nestjs/common';
import { UtilsProvider } from './utils.provider';

@Module({
  providers: [UtilsProvider],
  exports: [UtilsProvider],
})
export class UtilsModule {}
