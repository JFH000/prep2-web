import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CountryData,
  ICountryDataProvider,
} from '../shared/providers/country-data.interface';
import { CountryResponseDto } from './dto/country-response.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @Inject('ICountryDataProvider')
    private readonly countryDataProvider: ICountryDataProvider,
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
    // Buscar primero en la caché (base de datos local)
    let country = await this.countryRepository.findOne({
      where: { alpha3Code: alpha3Code.toUpperCase() },
    });

    if (country) {
      // Si existe en la caché, devolverlo indicando que viene de la caché
      return CountryResponseDto.fromEntity(country, 'cache');
    }

    // Si no existe en la caché, consultar la API externa
    const countryData: CountryData | null =
      await this.countryDataProvider.getCountryByAlpha3Code(
        alpha3Code.toUpperCase(),
      );

    if (!countryData) {
      throw new NotFoundException(
        `País con código alpha-3 '${alpha3Code}' no encontrado`,
      );
    }

    // Guardar en la base de datos
    country = this.countryRepository.create(countryData);
    country = await this.countryRepository.save(country);

    // Devolver indicando que viene de la API externa
    return CountryResponseDto.fromEntity(country, 'external');
  }

  async ensureCountryExists(alpha3Code: string): Promise<Country> {
    // Buscar en la caché
    let country = await this.countryRepository.findOne({
      where: { alpha3Code: alpha3Code.toUpperCase() },
    });

    if (country) {
      return country;
    }

    // Si no existe, obtenerlo de la API externa y guardarlo
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
}
