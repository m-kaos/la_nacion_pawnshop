import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';
import { CombosListComponent } from './combos-list.component';
import { ComboDetailComponent } from './combo-detail.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CombosListComponent },
      { path: ':id', component: ComboDetailComponent },
    ]),
  ],
  declarations: [CombosListComponent, ComboDetailComponent],
})
export class CombosModule {}
