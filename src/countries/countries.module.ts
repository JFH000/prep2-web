import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestCountriesProvider } from '../shared/providers/rest-countries.provider';
import { TravelPlansModule } from '../travel-plans/travel-plans.module';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';
import { AuthorizationGuard } from './guards/authorization.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    forwardRef(() => TravelPlansModule),
  ],
  controllers: [CountriesController],
  providers: [
    CountriesService,
    {
      provide: 'ICountryDataProvider',
      useClass: RestCountriesProvider,
    },
    RestCountriesProvider,
    AuthorizationGuard,
  ],
  exports: [CountriesService],
})
export class CountriesModule {}
