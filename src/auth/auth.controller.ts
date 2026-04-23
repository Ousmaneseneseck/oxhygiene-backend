import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

class RequestOtpDto { phone: string; }
class VerifyOtpDto { phone: string; code: string; }

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.phone);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const result = await this.authService.verifyOtp(dto.phone, dto.code);
    if (!result) {
      return { statusCode: 401, message: 'Code invalide ou expiré' };
    }
    return result;
  }
}
