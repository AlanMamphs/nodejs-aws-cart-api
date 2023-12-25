import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, User]), OrderModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
