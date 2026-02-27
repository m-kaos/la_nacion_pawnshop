import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Combo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column('simple-array', { comment: 'IDs de los artículos que forman el combo' })
  productIds!: number[];

  @Column({ type: 'int', default: 0, comment: 'Precio antes (MXN)' })
  precioAntes!: number;

  @Column({ type: 'int', default: 0, comment: 'Precio ahora / oferta (MXN)' })
  precioAhora!: number;

  @Column({ default: true })
  visible!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
