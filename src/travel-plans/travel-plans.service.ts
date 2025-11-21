import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelPlan } from './entities/travel-plan.entity';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlanResponseDto } from './dto/travel-plan-response.dto';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectRepository(TravelPlan)
    private readonly travelPlanRepository: Repository<TravelPlan>,
    private readonly countriesService: CountriesService,
  ) {}

  async create(
    createTravelPlanDto: CreateTravelPlanDto,
  ): Promise<TravelPlanResponseDto> {
    const startDate = new Date(createTravelPlanDto.startDate);
    const endDate = new Date(createTravelPlanDto.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Las fechas proporcionadas no son válidas');
    }

    if (startDate >= endDate) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de fin',
      );
    }

    try {
      await this.countriesService.ensureCountryExists(
        createTravelPlanDto.alpha3Code.toUpperCase(),
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException(
          `El país con código '${createTravelPlanDto.alpha3Code}' no existe`,
        );
      }
      throw error;
    }

    const travelPlan = this.travelPlanRepository.create({
      alpha3Code: createTravelPlanDto.alpha3Code.toUpperCase(),
      title: createTravelPlanDto.title,
      startDate: startDate,
      endDate: endDate,
      notes: createTravelPlanDto.notes ? createTravelPlanDto.notes : null,
    });

    const savedPlan = await this.travelPlanRepository.save(travelPlan);
    return TravelPlanResponseDto.fromEntity(savedPlan);
  }

  async findAll(): Promise<TravelPlanResponseDto[]> {
    const travelPlans = await this.travelPlanRepository.find({
      order: { createdAt: 'DESC' },
    });
    return travelPlans.map((plan) => TravelPlanResponseDto.fromEntity(plan));
  }

  async findOne(id: string): Promise<TravelPlanResponseDto> {
    const travelPlan = await this.travelPlanRepository.findOne({
      where: { id },
    });

    if (!travelPlan) {
      throw new NotFoundException(`Plan de viaje con ID '${id}' no encontrado`);
    }

    return TravelPlanResponseDto.fromEntity(travelPlan);
  }
}
