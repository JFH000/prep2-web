import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class CreateTravelPlanDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, {
    message:
      'alpha3Code debe ser un código de 3 letras mayúsculas (ej: COL, FRA)',
  })
  alpha3Code: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
