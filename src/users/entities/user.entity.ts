import { Cart } from '../../cart/entities/cart.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  shipping: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;
}
