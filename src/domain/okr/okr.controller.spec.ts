import { Test, TestingModule } from '@nestjs/testing';
import { OKRController } from './okr.controller';
import { OKRService } from './okr.service';

describe('OkrController', () => {
  let controller: OKRController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OKRController],
      providers: [OKRService],
    }).compile();

    controller = module.get<OKRController>(OKRController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
