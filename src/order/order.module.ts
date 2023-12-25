import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Order, Cart]), OrderModule],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
