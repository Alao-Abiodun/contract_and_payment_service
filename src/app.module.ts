import {
  MiddlewareConsumer,
  Module,
  OnApplicationBootstrap,
  RequestMethod,
} from '@nestjs/common';
import { ContractModule } from './app/contract/contract.module';
import { AuthModule } from './app/auth/auth.module';
import { JobModule } from './app/job/job.module';
import { AdminModule } from './app/admin/admin.module';
import { config as enviromentConfig } from 'src/shared/config';
import {
  AuthMiddleware,
  clientPermissionCheck,
} from './auth.guard/auth.middleware';

@Module({
  imports: [ContractModule, AuthModule, JobModule, AdminModule],
})
export class AppModule implements OnApplicationBootstrap {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/v1/contract/:id', method: RequestMethod.GET },
        { path: '/v1/jobs', method: RequestMethod.POST },
        { path: '/v1/jobs/:id/pay', method: RequestMethod.POST },
        { path: '/v1/balances/deposit/:userId', method: RequestMethod.POST },
      );

    consumer
      .apply(clientPermissionCheck)
      .forRoutes(
        { path: '/v1/jobs', method: RequestMethod.POST },
        { path: '/v1/jobs/:id/pay', method: RequestMethod.POST },
        { path: '/v1/balances/deposit/:userId', method: RequestMethod.POST },
      );
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
