import { Transform } from "class-transformer";
import { IsJSON, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

export class QueryArticleDto {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    page: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    pageSize: number;

    @IsJSON()
    @IsOptional()
    filters: string;
}