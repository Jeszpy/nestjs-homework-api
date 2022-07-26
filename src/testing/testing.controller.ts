import { Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(private testingService: TestingService) {}

  @HttpCode(204)
  @Delete('all-data')
  wipeAllData() {
    return this.testingService.wipeAllData();
  }
}
