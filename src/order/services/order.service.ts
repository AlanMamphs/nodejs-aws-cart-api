import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Order, OrderStatus } from '../entities/order.entity';
import { Cart, CartStatus } from '../../cart/entities/cart.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orders: Repository<Order>,

    private dataSource: DataSource,
  ) {}

  findById(orderId: string) {
    return this.orders.findOneBy({ id: orderId });
  }

  async listOrders() {
    return this.orders.find();
  }

  async checkout(data: {
    cart: Cart;
    orderDetails: {
      address: Record<string, string>;
      total: number;
    };
  }) {
    const { total, address: delivery } = data.orderDetails;
    await this.dataSource.transaction(async (manager) => {
      await manager.save(
        this.orders.create({
          delivery,
          total: total,
          user: data.cart.user,
          cart: data.cart,
          status: OrderStatus.PROCESSING,
        }),
      );

      await manager.update(Cart, data.cart.id, {
        status: CartStatus.ORDERED,
      });

      await manager.update(User, data.cart.user.id, {
        name: `${delivery.firstname} ${delivery.lastname}`,
        shipping: delivery.address,
      });
    });
  }

  async update(orderId: string, data: Order) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    return this.orders.update(orderId, data);
  }
}
