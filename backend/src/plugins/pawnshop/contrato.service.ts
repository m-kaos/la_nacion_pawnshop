import { Injectable } from '@nestjs/common';
import { TransactionalConnection } from '@vendure/core';
import { Contrato, EstadoContrato } from './contrato.entity';

export interface CreateContratoInput {
  customerId: number;
  productId: number;
  fechaContrato: string;
  plazo: number;
  tasaInteres: number;
  montoPrestamo: number;
  montoTotal: number;
  fechaVencimiento: string;
  estado?: EstadoContrato;
}

export interface UpdateContratoInput {
  customerId?: number;
  productId?: number;
  fechaContrato?: string;
  plazo?: number;
  tasaInteres?: number;
  montoPrestamo?: number;
  montoTotal?: number;
  fechaVencimiento?: string;
  estado?: EstadoContrato;
}

@Injectable()
export class ContratoService {
  constructor(private connection: TransactionalConnection) {}

  findAll(): Promise<Contrato[]> {
    return this.connection.rawConnection.getRepository(Contrato).find({
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: number): Promise<Contrato | null> {
    return this.connection.rawConnection.getRepository(Contrato).findOneBy({ id });
  }

  findByCustomer(customerId: number): Promise<Contrato[]> {
    return this.connection.rawConnection.getRepository(Contrato).findBy({ customerId });
  }

  create(input: CreateContratoInput): Promise<Contrato> {
    const repo = this.connection.rawConnection.getRepository(Contrato);
    const contrato = new Contrato();
    Object.assign(contrato, input);
    return repo.save(contrato);
  }

  async update(id: number, input: UpdateContratoInput): Promise<Contrato> {
    const repo = this.connection.rawConnection.getRepository(Contrato);
    await repo.update(id, input as any);
    return repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.connection.rawConnection.getRepository(Contrato).delete(id);
    return (result.affected ?? 0) > 0;
  }
}
