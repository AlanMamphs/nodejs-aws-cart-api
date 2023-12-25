import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { OrderService } from './services/order.service';

@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async listOrders(@Req() req: AppRequest) {
    const orders = await this.orderService.listOrders();

    return orders ?? [];
  }

  @UseGuards(BasicAuthGuard)
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }
}
