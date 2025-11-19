import { TravelPlan } from '../entities/travel-plan.entity';

export class TravelPlanResponseDto {
  id: string;
  alpha3Code: string;
  title: string;
  startDate: Date;
  endDate: Date;
  notes: string | null;
  createdAt: Date;

  static fromEntity(travelPlan: TravelPlan): TravelPlanResponseDto {
    const dto = new TravelPlanResponseDto();
    dto.id = travelPlan.id;
    dto.alpha3Code = travelPlan.alpha3Code;
    dto.title = travelPlan.title;
    dto.startDate = travelPlan.startDate;
    dto.endDate = travelPlan.endDate;
    dto.notes = travelPlan.notes;
    dto.createdAt = travelPlan.createdAt;
    return dto;
  }
}
