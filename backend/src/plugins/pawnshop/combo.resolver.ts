import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ComboService } from './combo.service';

@Resolver('Combo')
export class ComboResolver {
  constructor(private comboService: ComboService) {}

  @Query()
  combos() {
    return this.comboService.findAll();
  }

  @Query()
  combo(@Args('id') id: number) {
    return this.comboService.findById(id);
  }

  @Mutation()
  createCombo(@Args('input') input: any) {
    return this.comboService.create(input);
  }

  @Mutation()
  updateCombo(@Args('id') id: number, @Args('input') input: any) {
    return this.comboService.update(id, input);
  }

  @Mutation()
  deleteCombo(@Args('id') id: number) {
    return this.comboService.delete(id);
  }
}
