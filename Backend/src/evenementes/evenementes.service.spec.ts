import { Test, TestingModule } from '@nestjs/testing';
import { EvenementesService } from './evenementes.service';

describe('EvenementesService', () => {
  let service: EvenementesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvenementesService],
    }).compile();

    service = module.get<EvenementesService>(EvenementesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
