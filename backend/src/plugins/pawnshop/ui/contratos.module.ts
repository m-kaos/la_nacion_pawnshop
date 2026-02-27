import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';
import { ContratosListComponent } from './contratos-list.component';
import { ContratoDetailComponent } from './contrato-detail.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ContratosListComponent },
      { path: ':id', component: ContratoDetailComponent },
    ]),
  ],
  declarations: [ContratosListComponent, ContratoDetailComponent],
})
export class ContratosModule {}
