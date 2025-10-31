import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DisableTotpDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    token: string;
}