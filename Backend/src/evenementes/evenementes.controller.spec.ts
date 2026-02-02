import { Test, TestingModule } from '@nestjs/testing';
import { EvenementesController } from './evenementes.controller';
import { EvenementesService } from './evenementes.service';

describe('EvenementesController', () => {
  let controller: EvenementesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvenementesController],
      providers: [EvenementesService],
    }).compile();

    controller = module.get<EvenementesController>(EvenementesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
