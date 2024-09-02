import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { Contract } from './interface/contract.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('/v1/contract')
@ApiTags('auth')
@ApiBearerAuth()
export class ContractController {
  constructor(
    @Inject(ContractService)
    private readonly contractService: ContractService,
  ) {}

  @Post('/')
  async createContract(@Body() data: Contract) {
    return this.contractService.createContract(data);
  }

  @Get('/:id')
  async getContract(@Param('id') id: string) {
    return this.contractService.getContract(id);
  }
}
