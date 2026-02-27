import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoContrato {
  Activo = 'Activo',
  Liquidado = 'Liquidado',
  Vencido = 'Vencido',
}

@Entity()
export class Contrato {
  @PrimaryGeneratedColumn()
  id!: number;

  // References to Vendure Customer and Product (stored as IDs)
  @Column()
  customerId!: number;

  @Column()
  productId!: number;

  @Column({ type: 'date' })
  fechaContrato!: Date;

  @Column({ comment: 'Duración del contrato en meses' })
  plazo!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: 'Tasa de interés mensual (%)' })
  tasaInteres!: number;

  @Column({ comment: 'Monto del préstamo en centavos' })
  montoPrestamo!: number;

  @Column({ comment: 'Monto total a pagar con intereses en centavos' })
  montoTotal!: number;

  @Column({ type: 'date' })
  fechaVencimiento!: Date;

  @Column({ type: 'enum', enum: EstadoContrato, default: EstadoContrato.Activo })
  estado!: EstadoContrato;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
