import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart as CartEntity, CartStatus } from '../entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private userCarts: Repository<CartEntity>,
  ) {}

  findByUserId(userId: string): Promise<CartEntity | null> {
    return this.userCarts.findOneBy({ user_id: userId });
  }

  createByUserId(userId: string) {
    return this.userCarts.create({ user_id: userId, items: [] });
  }

  async findOrCreateByUserId(userId: string) {
    const userCart = this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }) {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    await this.userCarts.update(id, {
      items,
    });

    return { ...updatedCart };
  }

  async removeByUserId(userId: string) {
    const { id } = await this.findByUserId(userId);

    this.userCarts.update(id, { status: CartStatus.ORDERED });
  }
}
