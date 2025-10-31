import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'example@gmail.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '1234' })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Nguyễn Văn A' })
    fullName: string;
}