import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { AuthController } from './auth.controller';
import { Profile } from './entity/profile.model';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [LoginService, SignupService],
  controllers: [AuthController],
  exports: [LoginService, SignupService],
})
export class AuthModule {}
