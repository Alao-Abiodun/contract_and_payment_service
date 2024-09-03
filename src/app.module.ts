import {
  MiddlewareConsumer,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ContractModule } from './app/contract/contract.module';
import { AuthModule } from './app/auth/auth.module';
import { config as enviromentConfig } from 'src/shared/config';
import { AuthMiddleware } from './auth.guard/auth.middleware';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './app/job/job.module';
import { ContractService } from './app/contract/services/contract.service';
import { JobService } from './app/job/services/job.service';
import { AuthService } from './app/auth/services/auth.service';
import { ContractController } from './app/contract/contract.controller';

@Module({
  imports: [ContractModule, AuthModule, JobModule, DatabaseModule],
  controllers: [AppController, ContractController],
  providers: [AuthService, ContractService, JobService, AppService],
})
export class AppModule implements OnApplicationBootstrap {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ContractController);
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
