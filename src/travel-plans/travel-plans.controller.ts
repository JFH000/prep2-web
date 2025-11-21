import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlanResponseDto } from './dto/travel-plan-response.dto';
import { TravelPlansService } from './travel-plans.service';

@Controller('travel-plans')
@UseInterceptors(LoggingInterceptor)
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  @Post()
  async create(
    @Body() createTravelPlanDto: CreateTravelPlanDto,
  ): Promise<TravelPlanResponseDto> {
    return this.travelPlansService.create(createTravelPlanDto);
  }

  @Get()
  async findAll(): Promise<TravelPlanResponseDto[]> {
    return this.travelPlansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TravelPlanResponseDto> {
    return this.travelPlansService.findOne(id);
  }
}
