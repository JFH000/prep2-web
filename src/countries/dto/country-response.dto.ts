import { Country } from '../entities/country.entity';

export class CountryResponseDto {
  alpha3Code: string;
  name: string;
  region: string;
  subregion: string;
  capital: string;
  population: number;
  flagUrl: string;
  createdAt: Date;
  updatedAt: Date;
  source: 'cache' | 'external';

  static fromEntity(
    country: Country,
    source: 'cache' | 'external',
  ): CountryResponseDto {
    const dto = new CountryResponseDto();
    dto.alpha3Code = country.alpha3Code;
    dto.name = country.name;
    dto.region = country.region;
    dto.subregion = country.subregion;
    dto.capital = country.capital;
    dto.population = country.population;
    dto.flagUrl = country.flagUrl;
    dto.createdAt = country.createdAt;
    dto.updatedAt = country.updatedAt;
    dto.source = source;
    return dto;
  }
}
