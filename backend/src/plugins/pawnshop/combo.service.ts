import { Injectable } from '@nestjs/common';
import { TransactionalConnection } from '@vendure/core';
import { Combo } from './combo.entity';

export interface CreateComboInput {
  nombre: string;
  productIds: number[];
  precioAntes: number;
  precioAhora: number;
  visible?: boolean;
}

export interface UpdateComboInput {
  nombre?: string;
  productIds?: number[];
  precioAntes?: number;
  precioAhora?: number;
  visible?: boolean;
}

@Injectable()
export class ComboService {
  constructor(private connection: TransactionalConnection) {}

  findAll(): Promise<Combo[]> {
    return this.connection.rawConnection.getRepository(Combo).find({
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: number): Promise<Combo | null> {
    return this.connection.rawConnection.getRepository(Combo).findOneBy({ id });
  }

  create(input: CreateComboInput): Promise<Combo> {
    const repo = this.connection.rawConnection.getRepository(Combo);
    const combo = new Combo();
    Object.assign(combo, {
      ...input,
      visible: input.visible ?? true,
    });
    return repo.save(combo);
  }

  async update(id: number, input: UpdateComboInput): Promise<Combo> {
    const repo = this.connection.rawConnection.getRepository(Combo);
    await repo.update(id, input as any);
    return repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.connection.rawConnection.getRepository(Combo).delete(id);
    return (result.affected ?? 0) > 0;
  }
}
