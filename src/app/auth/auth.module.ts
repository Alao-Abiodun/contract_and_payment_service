import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProfileRepository } from './repositories/profile.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AuthService } from './services/auth.service';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService, ProfileRepository],
  controllers: [AuthController],
  exports: [AuthService, ProfileRepository],
})
export class AuthModule {}
