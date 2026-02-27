import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TransactionalConnection } from '@vendure/core';
import { ContratoService } from './contrato.service';
import { Contrato } from './contrato.entity';

@Resolver('Contrato')
export class ContratoResolver {
  constructor(
    private contratoService: ContratoService,
    private connection: TransactionalConnection,
  ) {}

  @Query()
  contratos() {
    return this.contratoService.findAll();
  }

  @Query()
  contrato(@Args('id') id: number) {
    return this.contratoService.findById(id);
  }

  @Query()
  contratosByCustomer(@Args('customerId') customerId: number) {
    return this.contratoService.findByCustomer(customerId);
  }

  @Mutation()
  createContrato(@Args('input') input: any) {
    return this.contratoService.create(input);
  }

  @Mutation()
  updateContrato(@Args('id') id: number, @Args('input') input: any) {
    return this.contratoService.update(id, input);
  }

  @Mutation()
  deleteContrato(@Args('id') id: number) {
    return this.contratoService.delete(id);
  }

  @ResolveField()
  async customerName(@Parent() contrato: Contrato): Promise<string> {
    const rows = await this.connection.rawConnection.query(
      'SELECT "firstName", "lastName" FROM customer WHERE id = $1',
      [contrato.customerId],
    );
    if (rows.length > 0) {
      const name = `${rows[0].firstName} ${rows[0].lastName}`.trim();
      return name || `Cliente #${contrato.customerId}`;
    }
    return `Cliente #${contrato.customerId}`;
  }
}
