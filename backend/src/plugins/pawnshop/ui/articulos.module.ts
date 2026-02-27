import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';
import { ArticulosListComponent } from './articulos-list.component';
import { ArticuloDetailComponent } from './articulo-detail.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ArticulosListComponent },
      { path: ':id', component: ArticuloDetailComponent },
    ]),
  ],
  declarations: [ArticulosListComponent, ArticuloDetailComponent],
})
export class ArticulosModule {}
