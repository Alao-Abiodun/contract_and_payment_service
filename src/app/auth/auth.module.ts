import { Module } from '@nestjs/common';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { AuthController } from './auth.controller';
import { Profile } from './entity/profile.model';
import { ProfileRepository } from './repositories/profile.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [LoginService, SignupService, ProfileRepository],
  controllers: [AuthController],
  exports: [LoginService, SignupService, ProfileRepository],
})
export class AuthModule {}
