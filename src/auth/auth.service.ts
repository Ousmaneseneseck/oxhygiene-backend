import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private otpStore = new Map<string, { code: string; expires: number }>();

  async requestOtp(phone: string): Promise<{ message: string }> {
    // Toujours générer le code 000000 pour les tests
    const code = '000000';
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    this.otpStore.set(phone, { code, expires });
    console.log(`[OTP] ${phone} -> ${code}`);
    return { message: 'OTP envoyé (code: 000000)' };
  }

  async verifyOtp(phone: string, code: string): Promise<{ access_token: string } | null> {
    // Pour les tests, accepter 000000 sans vérifier le store
    if (code === '000000') {
      const payload = { phone, sub: phone };
      const token = Buffer.from(JSON.stringify(payload)).toString('base64');
      return { access_token: token };
    }

    // Sinon vérifier dans le store
    const record = this.otpStore.get(phone);
    if (!record || record.code !== code || record.expires < Date.now()) {
      return null;
    }
    const payload = { phone, sub: phone };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    this.otpStore.delete(phone);
    return { access_token: token };
  }
}