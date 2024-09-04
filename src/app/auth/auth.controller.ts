import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';
import { depositMoney, Profile } from './interface/profile.interface';
import { hashPassword } from 'src/shared/utils/lib/bcrypt.helper';
import { AuthService } from './services/auth.service';

@Controller('/v1/auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly loginService: AuthService,
    @Inject(AuthService)
    private readonly signupService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() data: Profile) {
    const { email, password, first_name, last_name, profession, role } = data;

    const hashedPassword = await hashPassword(password);

    const userData = {
      email,
      password: hashedPassword,
      first_name,
      last_name,
      profession,
      role,
      uuid: uuidv4(),
    };

    return this.signupService.signup(userData);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.loginService.login(data.email, data.password);
  }

  @Post('balances/deposit/:userId')
  async deposit(@Param('userId') userId: string, @Body() data: depositMoney) {
    return this.loginService.deposit(userId, data);
  }
}
