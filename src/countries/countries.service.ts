import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CountryData,
  ICountryDataProvider,
} from '../shared/providers/country-data.interface';
import { TravelPlansService } from '../travel-plans/travel-plans.service';
import { CountryResponseDto } from './dto/country-response.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @Inject('ICountryDataProvider')
    private readonly countryDataProvider: ICountryDataProvider,
    @Inject(forwardRef(() => TravelPlansService))
    private readonly travelPlansService: TravelPlansService,
  ) {}

  async findAll(): Promise<CountryResponseDto[]> {
    const countries = await this.countryRepository.find({
      order: { name: 'ASC' },
    });
    return countries.map((country) =>
      CountryResponseDto.fromEntity(country, 'cache'),
    );
  }

  async findByAlpha3Code(alpha3Code: string): Promise<CountryResponseDto> {
    let country = await this.countryRepository.findOne({
      where: { alpha3Code: alpha3Code.toUpperCase() },
    });

    if (country) {
      return CountryResponseDto.fromEntity(country, 'cache');
    }

    const countryData: CountryData | null =
      await this.countryDataProvider.getCountryByAlpha3Code(
        alpha3Code.toUpperCase(),
      );

    if (!countryData) {
      throw new NotFoundException(
        `País con código alpha-3 '${alpha3Code}' no encontrado`,
      );
    }

    country = this.countryRepository.create(countryData);
    country = await this.countryRepository.save(country);

    return CountryResponseDto.fromEntity(country, 'external');
  }

  async ensureCountryExists(alpha3Code: string): Promise<Country> {
    let country = await this.countryRepository.findOne({
      where: { alpha3Code: alpha3Code.toUpperCase() },
    });

    if (country) {
      return country;
    }

    const countryData: CountryData | null =
      await this.countryDataProvider.getCountryByAlpha3Code(
        alpha3Code.toUpperCase(),
      );

    if (!countryData) {
      throw new NotFoundException(
        `País con código alpha-3 '${alpha3Code}' no encontrado`,
      );
    }

    country = this.countryRepository.create(countryData);
    return await this.countryRepository.save(country);
  }

  async delete(alpha3Code: string): Promise<void> {
    const country = await this.countryRepository.findOne({
      where: { alpha3Code: alpha3Code.toUpperCase() },
    });

    if (!country) {
      throw new NotFoundException(
        `País con código alpha-3 '${alpha3Code}' no encontrado`,
      );
    }

    const travelPlansCount = await this.travelPlansService.countByAlpha3Code(
      alpha3Code.toUpperCase(),
    );

    if (travelPlansCount > 0) {
      throw new BadRequestException(
        `No se puede eliminar el país '${alpha3Code}' porque tiene ${travelPlansCount} plan(es) de viaje asociado(s)`,
      );
    }

    await this.countryRepository.remove(country);
  }
}
