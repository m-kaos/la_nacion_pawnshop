import { Component, OnInit } from '@angular/core';
import { DataService } from '@vendure/admin-ui/core';
import { gql } from 'graphql-tag';

const GET_ARTICULOS = gql`
  query GetArticulos {
    products(options: { take: 200, sort: { updatedAt: DESC } }) {
      items {
        id
        name
        enabled
        variants {
          id
          sku
          price
        }
        customFields {
          marca
          modelo
          numeroDeSerie
          estadoArticulo
          valorAvaluo
        }
      }
      totalItems
    }
  }
`;

@Component({
  standalone: false,
  selector: 'articulos-list',
  styles: [`
    .estado-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .estado-disponible { background: #e3f0fb; color: #1a73b8; }
    .estado-empenado   { background: #fff3cd; color: #856404; }
    .estado-vendido    { background: #e6f4ea; color: #1e7e34; }
    .estado-retirado   { background: #f0f0f0; color: #666; }
  `],
  template: `
    <vdr-page-header>
      <vdr-page-title>Artículos en Inventario</vdr-page-title>
    </vdr-page-header>
    <vdr-page-body>
      <vdr-action-bar>
        <vdr-ab-right>
          <a class="btn btn-primary" [routerLink]="['./new']">
            <clr-icon shape="plus"></clr-icon>
            Nuevo Artículo
          </a>
        </vdr-ab-right>
      </vdr-action-bar>

      <vdr-card>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Marca / Modelo</th>
              <th>No. Serie</th>
              <th>Estado</th>
              <th>Avalúo (MXN)</th>
              <th>Precio Venta (MXN)</th>
              <th>SKU</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of articulos">
              <td>{{ a.id }}</td>
              <td>{{ a.name }}</td>
              <td>{{ a.customFields?.marca }} {{ a.customFields?.modelo }}</td>
              <td>{{ a.customFields?.numeroDeSerie || '—' }}</td>
              <td>
                <span class="estado-badge"
                  [class.estado-disponible]="a.customFields?.estadoArticulo === 'Disponible'"
                  [class.estado-empenado]="a.customFields?.estadoArticulo === 'Empeñado'"
                  [class.estado-vendido]="a.customFields?.estadoArticulo === 'Vendido'"
                  [class.estado-retirado]="a.customFields?.estadoArticulo === 'Retirado'">
                  {{ a.customFields?.estadoArticulo || '—' }}
                </span>
              </td>
              <td>\${{ (a.customFields?.valorAvaluo || 0) | number:'1.2-2' }}</td>
              <td>\${{ ((a.variants[0]?.price || 0) / 100) | number:'1.2-2' }}</td>
              <td>{{ a.variants[0]?.sku || '—' }}</td>
              <td style="text-align:right;">
                <a [routerLink]="['./', a.id]" class="btn btn-sm btn-secondary">
                  Editar →
                </a>
              </td>
            </tr>
            <tr *ngIf="articulos.length === 0">
              <td colspan="9" style="text-align:center; padding: 24px; color: #666;">
                No hay artículos registrados
              </td>
            </tr>
          </tbody>
        </table>
        <div style="padding: 8px 0; color: #666; font-size: 12px;">
          {{ total }} artículos en total
        </div>
      </vdr-card>
    </vdr-page-body>
  `,
})
export class ArticulosListComponent implements OnInit {
  articulos: any[] = [];
  total = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.query(GET_ARTICULOS).stream$.subscribe((result: any) => {
      this.articulos = result.products?.items ?? [];
      this.total = result.products?.totalItems ?? 0;
    });
  }
}
