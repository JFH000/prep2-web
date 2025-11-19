import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';
import { Country } from './countries/entities/country.entity';
import { TravelPlan } from './travel-plans/entities/travel-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'travel-planner.db',
      entities: [Country, TravelPlan],
      synchronize: true, // Solo para desarrollo. En producción usar migrations
      logging: false,
    }),
    CountriesModule,
    TravelPlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
