import { Test, TestingModule } from '@nestjs/testing';
import { BookClubsController } from './book-clubs.controller';

describe('BookClubsController', () => {
  let controller: BookClubsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookClubsController],
    }).compile();

    controller = module.get<BookClubsController>(BookClubsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
