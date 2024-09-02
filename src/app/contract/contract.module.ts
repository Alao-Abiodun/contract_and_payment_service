import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ContractController } from './contract.controller';
import { ContractService } from './services/contract.service';
import { ContractRepository } from './repositories/contract.repository';

@Module({
  imports: [DatabaseModule],
  providers: [ContractService, ContractRepository],
  controllers: [ContractController],
  exports: [ContractService, ContractRepository],
})
export class ContractModule {}
