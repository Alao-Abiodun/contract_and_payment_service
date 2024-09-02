import { Body, Controller, Inject, Post } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { LoginDto, SignUpDto } from './dto/auth.entity';
import { Profile } from './interface/profile.interface';
import { hashPassword } from 'src/shared/utils/lib/bcrypt.helper';

@Controller('/v1/auth')
@ApiTags('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    @Inject(LoginService)
    private readonly loginService: LoginService,
    @Inject(SignupService)
    private readonly signupService: SignupService,
  ) {}

  @Post('/login')
  async login(@Body() data: LoginDto) {
    return this.loginService.login(data.email, data.password);
  }

  @Post('/signup')
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
}
