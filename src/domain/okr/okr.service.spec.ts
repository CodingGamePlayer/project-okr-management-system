import { Test, TestingModule } from '@nestjs/testing';
import { OKRService } from './okr.service';

describe('OkrService', () => {
  let service: OKRService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OKRService],
    }).compile();

    service = module.get<OKRService>(OKRService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
