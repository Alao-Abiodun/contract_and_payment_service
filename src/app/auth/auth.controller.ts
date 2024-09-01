import { Body, Controller, Inject, Post } from '@nestjs/common';
import { uuid } from 'uuidv4';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { LoginDto, SignUpDto } from './dto/auth.entity';

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
  async signup(@Body() data: SignUpDto) {
    const { email, password, firstName, lastName, profession, role } = data;

    const userData = {
      email,
      password,
      firstName,
      lastName,
      profession,
      role,
      balance: 0,
      id: 0,
      uuid: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    delete userData.id;
    delete userData.createdAt;
    delete userData.updatedAt;

    return this.signupService.signup(userData);
  }
}
