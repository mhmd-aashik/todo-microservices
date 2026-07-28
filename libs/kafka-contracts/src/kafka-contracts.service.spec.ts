import { Test, TestingModule } from '@nestjs/testing';
import { KafkaContractsService } from './kafka-contracts.service';

describe('KafkaContractsService', () => {
  let service: KafkaContractsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaContractsService],
    }).compile();

    service = module.get<KafkaContractsService>(KafkaContractsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
