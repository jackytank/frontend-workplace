import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChangePasswordDto } from './password.dto';

@ApiTags('password')
@Controller('ecas/EcaService.svc')
export class PasswordController {
    @Post('DoPasswdChange')
    @ApiOperation({ summary: 'Change user password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully.' })
    changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        const { ProgramCode } = changePasswordDto;

        // Dummy response
        return {
            ProgramCode: ProgramCode,
            StatusCode: "000",
            StatusCodeDetails: "",
            Version: "1.1.11.7"
        };
    }
}

