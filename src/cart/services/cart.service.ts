import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart, CartStatus } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private userCarts: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItems: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await this.userCarts.findOneBy({ user_id: userId });

    if (!cart) {
      return null;
    }
    return cart;
  }

  async createByUserId(userId: string) {
    return this.userCarts.save(
      this.userCarts.create({ user_id: userId, items: [] }),
    );
  }

  async findOrCreateByUserId(userId: string) {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, params: { status: string; items: [] }) {
    console.log(params);
    const { id, items, ...rest } = await this.findOrCreateByUserId(userId);

    await this.userCarts.update(id, rest);

    return { id, items: params.items, ...rest };
  }

  async addItemToCart(
    userId: string,
    params: {
      product: {
        price: number;
        id: string;
        description: string;
        title: string;
      };
      count: number;
    },
  ) {
    const cart = await this.findOrCreateByUserId(userId);

    const cartItem = await this.cartItems.save(
      this.cartItems.create({
        cart,
        count: params.count,
        product: params.product,
      }),
    );

    return { ...cart, items: [...cart.items, cartItem] };
  }

  async removeByUserId(userId: string) {
    const { id } = await this.findByUserId(userId);

    this.userCarts.update(id, { status: CartStatus.ORDERED });
  }
}
