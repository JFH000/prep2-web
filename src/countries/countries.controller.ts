import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryResponseDto } from './dto/country-response.dto';
import { AuthorizationGuard } from './guards/authorization.guard';

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

  @Delete(':alpha3Code')
  @UseGuards(AuthorizationGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('alpha3Code') alpha3Code: string): Promise<void> {
    return this.countriesService.delete(alpha3Code);
  }
}
