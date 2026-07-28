import { Module } from '@nestjs/common';
import { GrpcContractsService } from './grpc-contracts.service';

@Module({
  providers: [GrpcContractsService],
  exports: [GrpcContractsService],
})
export class GrpcContractsModule {}
