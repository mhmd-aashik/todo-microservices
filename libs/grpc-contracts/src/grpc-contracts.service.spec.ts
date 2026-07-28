import { Test, TestingModule } from '@nestjs/testing';
import { GrpcContractsService } from './grpc-contracts.service';

describe('GrpcContractsService', () => {
  let service: GrpcContractsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrpcContractsService],
    }).compile();

    service = module.get<GrpcContractsService>(GrpcContractsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
