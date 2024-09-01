import {
  MiddlewareConsumer,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { config as enviromentConfig } from 'src/shared/config';
import { LoginService } from './app/auth/services/login.service';
import { SignupService } from './app/auth/services/signup.service';
import { AuthMiddleware } from './auth.guard/auth.middleware';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UserModule, AuthModule, DatabaseModule],
  controllers: [AppController],
  providers: [LoginService, SignupService, AppService],
})
export class AppModule implements OnApplicationBootstrap {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('v1');
  }
  async onApplicationBootstrap() {
    if (enviromentConfig.isDevelopment) {
      console.log(`
      server running on port ${enviromentConfig.port.http}
      swagger docs link on port http://localhost:${enviromentConfig.port.http}/
      `);
    }
  }
}
