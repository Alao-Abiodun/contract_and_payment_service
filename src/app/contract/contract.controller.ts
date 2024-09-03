import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
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

  @Get('/')
  async getContracts() {
    return this.contractService.getContracts();
  }

  @Get('/:id')
  async getContractById(@Param('id') id: string, @Req() req: any) {
    return this.contractService.getSingleContracts(id, req.profile.id);
  }
}
