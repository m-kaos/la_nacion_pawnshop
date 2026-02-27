import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule, addNavMenuItem, registerCustomDetailComponent } from '@vendure/admin-ui/core';
import { CustomerContratosComponent } from './customer-contratos.component';

@NgModule({
  imports: [SharedModule, RouterModule],
  declarations: [CustomerContratosComponent],
  providers: [
    addNavMenuItem(
      {
        id: 'articulos',
        label: 'Artículos',
        routerLink: ['/extensions/articulos'],
        icon: 'tag',
        requiresPermission: 'Authenticated',
      },
      'catalog',
    ),
    addNavMenuItem(
      {
        id: 'contratos',
        label: 'Contratos',
        routerLink: ['/extensions/contratos'],
        icon: 'assign-user',
        requiresPermission: 'Authenticated',
      },
      'sales',
    ),
    addNavMenuItem(
      {
        id: 'combos',
        label: 'Combos',
        routerLink: ['/extensions/combos'],
        icon: 'bundle',
        requiresPermission: 'Authenticated',
      },
      'marketing',
    ),
    registerCustomDetailComponent({
      locationId: 'customer-detail',
      component: CustomerContratosComponent,
    }),
  ],
})
export class ContratosSharedModule {}
