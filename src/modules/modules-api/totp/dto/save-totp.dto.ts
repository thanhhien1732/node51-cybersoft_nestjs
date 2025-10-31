import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SaveTotpDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    secret: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    token: string;
}