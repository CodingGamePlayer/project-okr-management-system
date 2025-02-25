import { Test, TestingModule } from '@nestjs/testing';
import { DeliverableService } from './deliverable.service';

describe('DeliverableService', () => {
  let service: DeliverableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliverableService],
    }).compile();

    service = module.get<DeliverableService>(DeliverableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
