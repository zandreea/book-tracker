import { Test, TestingModule } from '@nestjs/testing';
import { BookClubsService } from './book-clubs.service';

describe('BookClubsService', () => {
  let service: BookClubsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookClubsService],
    }).compile();

    service = module.get<BookClubsService>(BookClubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
