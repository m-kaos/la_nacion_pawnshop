import { Component, OnInit } from '@angular/core';
import { DataService, SharedModule } from '@vendure/admin-ui/core';
import { RouterModule } from '@angular/router';
import { gql } from 'graphql-tag';

const GET_CONTRATOS = gql`
  query GetContratos {
    contratos {
      id
      customerId
      customerName
      productId
      estado
      montoPrestamo
      montoTotal
      fechaContrato
      fechaVencimiento
      plazo
      tasaInteres
    }
  }
`;

@Component({
  standalone: false,
  selector: 'contratos-list',
  styles: [`
    .estado-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .estado-activo { background: #e3f0fb; color: #1a73b8; }
    .estado-liquidado { background: #e6f4ea; color: #1e7e34; }
    .estado-vencido { background: #fce8e8; color: #c0392b; }
  `],
  template: `
    <vdr-page-header>
      <vdr-page-title>Contratos de Empeño</vdr-page-title>
    </vdr-page-header>
    <vdr-page-body>
      <vdr-action-bar>
        <vdr-ab-right>
          <a class="btn btn-primary" [routerLink]="['./new']">
            <clr-icon shape="plus"></clr-icon>
            Nuevo Contrato
          </a>
        </vdr-ab-right>
      </vdr-action-bar>

      <vdr-card>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Estado</th>
              <th>Préstamo (MXN)</th>
              <th>Total (MXN)</th>
              <th>Fecha</th>
              <th>Vencimiento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of contratos">
              <td>{{ c.id }}</td>
              <td>
                <a [routerLink]="['/customer/customers', c.customerId]">
                  {{ c.customerName }}
                </a>
              </td>
              <td>
                <a [routerLink]="['/catalog/products', c.productId]">
                  Producto #{{ c.productId }}
                </a>
              </td>
              <td>
                <span class="estado-badge"
                  [class.estado-activo]="c.estado === 'Activo'"
                  [class.estado-liquidado]="c.estado === 'Liquidado'"
                  [class.estado-vencido]="c.estado === 'Vencido'">
                  {{ c.estado }}
                </span>
              </td>
              <td>\${{ c.montoPrestamo | number:'1.2-2' }}</td>
              <td>\${{ c.montoTotal | number:'1.2-2' }}</td>
              <td>{{ c.fechaContrato | date:'dd/MM/yyyy' }}</td>
              <td>{{ c.fechaVencimiento | date:'dd/MM/yyyy' }}</td>
              <td style="text-align:right;">
                <a [routerLink]="['./', c.id]" class="btn btn-sm btn-secondary">
                  Editar →
                </a>
              </td>
            </tr>
            <tr *ngIf="contratos.length === 0">
              <td colspan="9" style="text-align:center; padding: 24px; color: #666;">
                No hay contratos registrados
              </td>
            </tr>
          </tbody>
        </table>
      </vdr-card>
    </vdr-page-body>
  `,
})
export class ContratosListComponent implements OnInit {
  contratos: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.query(GET_CONTRATOS).stream$.subscribe((result: any) => {
      this.contratos = result.contratos ?? [];
    });
  }
}
