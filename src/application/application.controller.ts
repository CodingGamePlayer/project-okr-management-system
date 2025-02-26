import { Controller } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
}
