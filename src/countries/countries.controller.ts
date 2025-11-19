import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryResponseDto } from './dto/country-response.dto';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(): Promise<CountryResponseDto[]> {
    return this.countriesService.findAll();
  }

  @Get(':alpha3Code')
  async findByAlpha3Code(
    @Param('alpha3Code') alpha3Code: string,
  ): Promise<CountryResponseDto> {
    return this.countriesService.findByAlpha3Code(alpha3Code);
  }
}
