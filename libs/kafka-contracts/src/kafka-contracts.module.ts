import { Module } from '@nestjs/common';
import { KafkaContractsService } from './kafka-contracts.service';

@Module({
  providers: [KafkaContractsService],
  exports: [KafkaContractsService],
})
export class KafkaContractsModule {}
