import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
    @ApiProperty()
    UserID: string;

    @ApiProperty()
    Password: string;

    @ApiProperty()
    Version: string;

    @ApiProperty()
    LanguageType: string;

    @ApiProperty()
    ProgramCode: string;

    @ApiProperty()
    NewPassword: string;
}