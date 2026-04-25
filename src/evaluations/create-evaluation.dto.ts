import { IsInt, IsString, IsOptional, IsArray, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const VALID_TAGS = ['Cheiro de esgoto', 'Água turva', 'Gosto estranho', 'Cor escura', 'Sem problemas'];

export class CreateEvaluationDto {
  @ApiProperty({ description: 'ID do bairro' })
  @IsString()
  neighborhoodId: string;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  odor: number;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  color: number;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  taste: number;

  @ApiPropertyOptional({ type: [String], enum: VALID_TAGS })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
}
