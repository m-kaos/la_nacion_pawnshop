import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { DataService } from '@vendure/admin-ui/core';
import { gql } from 'graphql-tag';

const GET_CONTRATOS_BY_CUSTOMER = gql`
  query GetContratosByCustomer($customerId: Int!) {
    contratosByCustomer(customerId: $customerId) {
      id
      estado
      montoPrestamo
      montoTotal
      fechaContrato
      fechaVencimiento
      plazo
      tasaInteres
      productId
    }
  }
`;

@Component({
  standalone: false,
  selector: 'customer-contratos',
  styles: [`
    .contratos-empty { padding: 12px 0 4px; color: #666; }
    .contratos-table { width: 100%; margin-top: 8px; }
    .contratos-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #666; padding: 6px 12px; border-bottom: 1px solid #ddd; }
    .contratos-table td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    .contratos-table tr:last-child td { border-bottom: none; }
    .estado-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .estado-activo { background: #e3f0fb; color: #1a73b8; }
    .estado-liquidado { background: #e6f4ea; color: #1e7e34; }
    .estado-vencido { background: #fce8e8; color: #c0392b; }
    .actions-row { padding: 12px 0 4px; }
  `],
  template: `
    <vdr-card title="Contratos de Empeño">
      <div *ngIf="contratos.length === 0" class="contratos-empty">
        <p style="margin-bottom:10px;">Este cliente no tiene contratos registrados.</p>
        <a [routerLink]="['/extensions/contratos/new']" class="btn btn-sm btn-primary">
          <clr-icon shape="plus"></clr-icon>
          Nuevo Contrato
        </a>
      </div>

      <ng-container *ngIf="contratos.length > 0">
        <table class="contratos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Producto</th>
              <th>Préstamo</th>
              <th>Total</th>
              <th>Vencimiento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of contratos">
              <td>{{ c.id }}</td>
              <td>
                <span class="estado-badge"
                  [class.estado-activo]="c.estado === 'Activo'"
                  [class.estado-liquidado]="c.estado === 'Liquidado'"
                  [class.estado-vencido]="c.estado === 'Vencido'">
                  {{ c.estado }}
                </span>
              </td>
              <td>
                <a [routerLink]="['/catalog/products', c.productId]" style="color: inherit">
                  Producto #{{ c.productId }}
                </a>
              </td>
              <td>\${{ c.montoPrestamo | number:'1.2-2' }}</td>
              <td>\${{ c.montoTotal | number:'1.2-2' }}</td>
              <td>{{ c.fechaVencimiento | date:'dd/MM/yyyy' }}</td>
              <td style="text-align:right;">
                <a [routerLink]="['/extensions/contratos', c.id]" class="btn btn-sm btn-secondary">
                  Ver →
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="actions-row">
          <a [routerLink]="['/extensions/contratos/new']" class="btn btn-sm btn-primary">
            <clr-icon shape="plus"></clr-icon>
            Nuevo Contrato
          </a>
        </div>
      </ng-container>
    </vdr-card>
  `,
})
export class CustomerContratosComponent implements OnInit {
  entity$!: Observable<any>;
  detailForm!: UntypedFormGroup;

  contratos: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.entity$
      .pipe(
        filter((entity) => !!entity?.id),
        switchMap((entity) =>
          this.dataService
            .query(GET_CONTRATOS_BY_CUSTOMER, { customerId: +entity.id })
            .stream$,
        ),
      )
      .subscribe((result: any) => {
        this.contratos = result.contratosByCustomer ?? [];
      });
  }
}
