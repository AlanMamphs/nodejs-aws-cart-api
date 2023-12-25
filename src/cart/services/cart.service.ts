import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { Cart, CartStatus } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private userCarts: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItems: Repository<CartItem>,
    @InjectRepository(User)
    private users: Repository<User>,
  ) {}

  async findByUserId(userId: string): Promise<Cart | null> {
    let user = await this.users.findOneBy({ id: userId });
    if (!user) {
      user = await this.users.save(this.users.create({ id: userId }));
    }
    const cart = await this.userCarts.findOneBy({
      user,
      status: CartStatus.OPEN,
    });

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
    let cartItem = null;

    const existingCartItem = cart.items.find(
      (p) => p.product.id === params.product.id,
    );
    if (existingCartItem) {
      const count = existingCartItem.count + params.count;
      await this.cartItems.update(existingCartItem.id, {
        count,
      });
      cartItem = { ...existingCartItem, count };
    } else {
      cartItem = await this.cartItems.save(
        this.cartItems.create({
          cart,
          count: params.count,
          product: params.product,
          productId: params.product.id,
        }),
      );
    }

    return {
      ...cart,
      items: [
        ...cart.items.filter((ci) => ci.productId !== params.product.id),
        cartItem,
      ],
    };
  }

  async removeByUserId(userId: string) {
    this.userCarts.remove(await this.findByUserId(userId));
  }
}
